import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user, context) => {
  try {
    const { params } = context || {}
    if (!params) {
      return NextResponse.json({ error: "Parámetros no disponibles" }, { status: 400 })
    }

    const resolvedParams = await params
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "ID de instructor requerido" }, { status: 400 })
    }

    const instructor = await prisma.user.findUnique({
      where: {
        id: resolvedParams.id,
        role: "INSTRUCTOR",
      },
      include: {
        centro: {
          select: { nombre: true, codigo: true, direccion: true, telefono: true },
        },
        solicitudes: {
          include: {
            programa: {
              select: { nombre: true, codigo: true, duracionHoras: true, modalidad: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!instructor) {
      return NextResponse.json({ error: "Instructor no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    if (user.role === "COORDINADOR" && instructor.centroId !== user.centroId) {
      return NextResponse.json({ error: "No tienes permisos para ver este instructor" }, { status: 403 })
    }

    if (user.role === "INSTRUCTOR" && instructor.id !== user.userId) {
      return NextResponse.json({ error: "No tienes permisos para ver este perfil" }, { status: 403 })
    }

    const solicitudesAprobadas = instructor.solicitudes.filter((s) => s.estado === "APROBADA")
    const solicitudesPendientes = instructor.solicitudes.filter((s) => s.estado === "PENDIENTE")
    const solicitudesRechazadas = instructor.solicitudes.filter((s) => s.estado === "RECHAZADA")

    const totalAprendices = solicitudesAprobadas.reduce((sum, s) => sum + s.numeroAprendicesInscribir, 0)
    const horasFormacion = solicitudesAprobadas.reduce((sum, s) => sum + s.programa.duracionHoras, 0)
    const tasaAprobacion =
      instructor.solicitudes.length > 0 ? (solicitudesAprobadas.length / instructor.solicitudes.length) * 100 : 0

    // Calcular tendencias mensuales
    const fechaActual = new Date()
    const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
    const solicitudesEsteMes = instructor.solicitudes.filter((s) => new Date(s.createdAt) >= inicioMes)

    const perfilCompleto = {
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
      cedula: instructor.cedula,
      telefono: instructor.telefono,
      especialidad: instructor.especialidad,
      isActive: instructor.isActive,
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
      centro: instructor.centro,
      estadisticas: {
        totalSolicitudes: instructor.solicitudes.length,
        solicitudesAprobadas: solicitudesAprobadas.length,
        solicitudesPendientes: solicitudesPendientes.length,
        solicitudesRechazadas: solicitudesRechazadas.length,
        tasaAprobacion: Math.round(tasaAprobacion),
        totalAprendices,
        horasFormacion,
        solicitudesEsteMes: solicitudesEsteMes.length,
        promedioAprendicesPorSolicitud:
          solicitudesAprobadas.length > 0 ? Math.round(totalAprendices / solicitudesAprobadas.length) : 0,
      },
      solicitudesRecientes: instructor.solicitudes.slice(0, 5).map((s) => ({
        id: s.id,
        codigo: s.codigo,
        estado: s.estado,
        fechaSolicitud: s.createdAt,
        programa: s.programa,
        numeroAprendices: s.numeroAprendicesInscribir,
      })),
      rendimiento: {
        nivel:
          tasaAprobacion >= 90
            ? "EXCELENTE"
            : tasaAprobacion >= 80
              ? "BUENO"
              : tasaAprobacion >= 70
                ? "REGULAR"
                : "NECESITA_MEJORA",
        puntuacion: Math.round(tasaAprobacion),
        areas_fortaleza: instructor.especialidad ? [instructor.especialidad] : [],
        recomendaciones:
          tasaAprobacion < 80
            ? [
                "Revisar justificaciones de solicitudes",
                "Mejorar documentación de programas",
                "Coordinar con el equipo académico",
              ]
            : [],
      },
    }

    return NextResponse.json({ instructor: perfilCompleto })
  } catch (error) {
    console.error("Error obteniendo instructor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})

export const PUT = withAuth(async (req: NextRequest, user, context) => {
  try {
    const { params } = context || {}
    if (!params) {
      return NextResponse.json({ error: "Parámetros no disponibles" }, { status: 400 })
    }

    const resolvedParams = await params
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "ID de instructor requerido" }, { status: 400 })
    }

    const data = await req.json()

    // Verificar que el instructor existe
    const existingInstructor = await prisma.user.findUnique({
      where: {
        id: resolvedParams.id,
        role: "INSTRUCTOR",
      },
    })

    if (!existingInstructor) {
      return NextResponse.json({ error: "Instructor no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    if (user.role === "COORDINADOR" && existingInstructor.centroId !== user.centroId) {
      return NextResponse.json({ error: "No tienes permisos para editar este instructor" }, { status: 403 })
    }

    if (user.role === "INSTRUCTOR" && existingInstructor.id !== user.userId) {
      return NextResponse.json({ error: "No tienes permisos para editar este perfil" }, { status: 403 })
    }

    // Validar email único si se está cambiando
    if (data.email && data.email !== existingInstructor.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      })
      if (emailExists) {
        return NextResponse.json({ error: "Ya existe un usuario con este correo electrónico" }, { status: 400 })
      }
    }

    // Validar cédula única si se está cambiando
    if (data.cedula && data.cedula !== existingInstructor.cedula) {
      const cedulaExists = await prisma.user.findUnique({
        where: { cedula: data.cedula },
      })
      if (cedulaExists) {
        return NextResponse.json({ error: "Ya existe un usuario con esta cédula" }, { status: 400 })
      }
    }

    const instructor = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: {
        name: data.name,
        email: data.email,
        cedula: data.cedula,
        telefono: data.telefono,
        especialidad: data.especialidad,
        isActive: data.isActive,
      },
      include: {
        centro: {
          select: { nombre: true, codigo: true },
        },
      },
    })

    return NextResponse.json({
      message: "Instructor actualizado exitosamente",
      instructor,
    })
  } catch (error) {
    console.error("Error actualizando instructor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (req: NextRequest, user, context) => {
  try {
    const { params } = context || {}
    if (!params) {
      return NextResponse.json({ error: "Parámetros no disponibles" }, { status: 400 })
    }

    const resolvedParams = await params
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "ID de instructor requerido" }, { status: 400 })
    }

    if (user.role !== "COORDINADOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para eliminar instructores" }, { status: 403 })
    }

    // Verificar que el instructor existe
    const existingInstructor = await prisma.user.findUnique({
      where: {
        id: resolvedParams.id,
        role: "INSTRUCTOR",
      },
      include: {
        solicitudes: {
          where: {
            estado: { in: ["PENDIENTE", "APROBADA"] },
          },
        },
      },
    })

    if (!existingInstructor) {
      return NextResponse.json({ error: "Instructor no encontrado" }, { status: 404 })
    }

    // Verificar permisos de centro
    if (user.role === "COORDINADOR" && existingInstructor.centroId !== user.centroId) {
      return NextResponse.json({ error: "No tienes permisos para eliminar este instructor" }, { status: 403 })
    }

    // No eliminar si tiene solicitudes activas
    if (existingInstructor.solicitudes.length > 0) {
      return NextResponse.json(
        {
          error: "No se puede eliminar un instructor con solicitudes activas. Desactívalo en su lugar.",
        },
        { status: 400 },
      )
    }

    // Soft delete - marcar como inactivo
    await prisma.user.update({
      where: { id: resolvedParams.id },
      data: {
        isActive: false,
        email: `${existingInstructor.email}.deleted.${Date.now()}`, // Liberar email para reutilización
      },
    })

    return NextResponse.json({
      message: "Instructor desactivado exitosamente",
    })
  } catch (error) {
    console.error("Error eliminando instructor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
