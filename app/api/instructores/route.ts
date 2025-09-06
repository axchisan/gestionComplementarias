import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search")
    const especialidad = searchParams.get("especialidad")
    const estado = searchParams.get("estado")

    const where: any = {}

    // Filtrar por rol del usuario
    if (user.role === "COORDINADOR") {
      where.centroId = user.centroId
    }

    // Filtros adicionales
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { cedula: { contains: search } },
        { especialidad: { contains: search, mode: "insensitive" } },
      ]
    }

    if (especialidad) {
      where.especialidad = especialidad
    }

    if (estado) {
      where.isActive = estado === "activo"
    }

    const [instructores, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...where,
          role: "INSTRUCTOR",
        },
        include: {
          centro: {
            select: { nombre: true, codigo: true },
          },
          solicitudes: {
            select: {
              id: true,
              estado: true,
              numeroAprendicesInscribir: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({
        where: {
          ...where,
          role: "INSTRUCTOR",
        },
      }),
    ])

    const instructoresConMetricas = instructores.map((instructor) => {
      const solicitudesAprobadas = instructor.solicitudes.filter((s) => s.estado === "APROBADA").length
      const totalSolicitudes = instructor.solicitudes.length
      const tasaAprobacion = totalSolicitudes > 0 ? (solicitudesAprobadas / totalSolicitudes) * 100 : 0
      const totalAprendices = instructor.solicitudes.reduce((sum, s) => sum + s.numeroAprendicesInscribir, 0)

      return {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        cedula: instructor.cedula,
        telefono: instructor.telefono,
        especialidad: instructor.especialidad,
        isActive: instructor.isActive,
        createdAt: instructor.createdAt,
        centro: instructor.centro,
        estadisticas: {
          totalSolicitudes,
          solicitudesAprobadas,
          tasaAprobacion: Math.round(tasaAprobacion),
          totalAprendices,
          solicitudesPendientes: instructor.solicitudes.filter((s) => s.estado === "PENDIENTE").length,
        },
      }
    })

    return NextResponse.json({
      instructores: instructoresConMetricas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error obteniendo instructores:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    if (user.role !== "COORDINADOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para crear instructores" }, { status: 403 })
    }

    const data = await req.json()

    // Validar email único
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Ya existe un usuario con este correo electrónico" }, { status: 400 })
    }

    // Validar cédula única
    const existingCedula = await prisma.user.findUnique({
      where: { cedula: data.cedula },
    })

    if (existingCedula) {
      return NextResponse.json({ error: "Ya existe un usuario con esta cédula" }, { status: 400 })
    }

    // Validar email institucional
    if (!data.email.endsWith("@sena.edu.co") && !data.email.endsWith("@misena.edu.co")) {
      return NextResponse.json({ error: "Debe usar un correo electrónico institucional del SENA" }, { status: 400 })
    }

    // Generar contraseña temporal
    const tempPassword = `SENA${data.cedula.slice(-4)}${new Date().getFullYear()}`
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Crear instructor
    const instructor = await prisma.user.create({
      data: {
        name: `${data.nombres} ${data.apellidos}`,
        email: data.email,
        password: hashedPassword,
        cedula: data.cedula,
        telefono: data.telefono,
        especialidad: data.especialidad,
        role: "INSTRUCTOR",
        centroId: user.centroId, // Asignar al centro del coordinador
        isActive: true,
      },
      include: {
        centro: {
          select: { nombre: true, codigo: true },
        },
      },
    })

    // TODO: Enviar email con credenciales temporales
    console.log(`Credenciales temporales para ${instructor.email}: ${tempPassword}`)

    return NextResponse.json(
      {
        message: "Instructor registrado exitosamente",
        instructor: {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          cedula: instructor.cedula,
          especialidad: instructor.especialidad,
          centro: instructor.centro,
        },
        credencialesTemporales: {
          email: instructor.email,
          password: tempPassword,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creando instructor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
