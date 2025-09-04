import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get("estado")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {}

    // Filtrar por rol
    if (user.role === "INSTRUCTOR") {
      where.instructorId = user.userId
    } else if (user.role === "COORDINADOR") {
      where.programa = {
        centroId: user.centroId,
      }
    }

    if (estado) {
      if (estado.includes(",")) {
        const estados = estado.split(",").map((e) => e.trim().toUpperCase())
        where.estado = { in: estados }
      } else {
        where.estado = estado.toUpperCase()
      }
    }

    const [solicitudes, total] = await Promise.all([
      prisma.solicitud.findMany({
        where,
        include: {
          instructor: {
            select: { name: true, email: true, especialidad: true },
          },
          programa: {
            select: {
              nombre: true,
              codigo: true,
              duracionHoras: true,
              modalidad: true,
              centro: { select: { nombre: true } },
            },
          },
          horarios: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.solicitud.count({ where }),
    ])

    return NextResponse.json({
      solicitudes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error obteniendo solicitudes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    if (user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Solo los instructores pueden crear solicitudes" }, { status: 403 })
    }

    const data = await req.json()

    // Validar que el programa existe y pertenece al centro del instructor
    const programa = await prisma.programa.findFirst({
      where: {
        id: data.programaId,
        centroId: user.centroId,
        isActive: true,
      },
    })

    if (!programa) {
      return NextResponse.json({ error: "Programa no válido o no disponible" }, { status: 400 })
    }

    // Generar código único para la solicitud
    const year = new Date().getFullYear()
    const lastSolicitud = await prisma.solicitud.findFirst({
      where: {
        codigo: { startsWith: `SOL-${year}-` },
      },
      orderBy: { codigo: "desc" },
    })

    let nextNumber = 1
    if (lastSolicitud) {
      const lastNumber = Number.parseInt(lastSolicitud.codigo.split("-")[2])
      nextNumber = lastNumber + 1
    }

    const codigo = `SOL-${year}-${nextNumber.toString().padStart(3, "0")}`

    // Crear la solicitud
    const solicitud = await prisma.solicitud.create({
      data: {
        codigo,
        instructorId: user.userId,
        programaId: data.programaId,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: new Date(data.fechaFin),
        numeroAprendices: data.numeroAprendices,
        justificacion: data.justificacion,
        objetivosPersonalizados: data.objetivosPersonalizados || [],
        resultadosEsperados: data.resultadosEsperados,
        metodologia: data.metodologia,
        recursosNecesarios: data.recursosNecesarios,
        criteriosEvaluacion: data.criteriosEvaluacion,
        observaciones: data.observaciones,
        cumpleRequisitos: data.cumpleRequisitos,
        autorizaUsoInfo: data.autorizaUsoInfo,
        confirmaVeracidad: data.confirmaVeracidad,
        estado: data.isDraft ? "BORRADOR" : "PENDIENTE",
        horarios: {
          create:
            data.horarios?.map((horario: any) => ({
              diaSemana: horario.diaSemana,
              horaInicio: horario.horaInicio,
              horaFin: horario.horaFin,
            })) || [],
        },
      },
      include: {
        programa: {
          select: { nombre: true, codigo: true },
        },
        horarios: true,
      },
    })

    return NextResponse.json(
      {
        message: "Solicitud creada exitosamente",
        solicitud,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creando solicitud:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
