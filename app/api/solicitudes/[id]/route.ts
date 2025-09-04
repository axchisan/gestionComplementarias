import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
            cedula: true,
            telefono: true,
            especialidad: true,
            centro: { select: { nombre: true } },
          },
        },
        programa: {
          include: {
            centro: { select: { nombre: true } },
            objetivos: { orderBy: { orden: "asc" } },
            competencias: true,
            resultados: true,
          },
        },
        horarios: {
          orderBy: { diaSemana: "asc" },
        },
      },
    })

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
    }

    // Verificar permisos
    if (user.role === "INSTRUCTOR" && solicitud.instructorId !== user.userId) {
      return NextResponse.json({ error: "No tienes permisos para ver esta solicitud" }, { status: 403 })
    }

    if (user.role === "COORDINADOR" && solicitud.programa.centroId !== user.centroId) {
      return NextResponse.json({ error: "No tienes permisos para ver esta solicitud" }, { status: 403 })
    }

    return NextResponse.json({ solicitud })
  } catch (error) {
    console.error("Error obteniendo solicitud:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})

export const PUT = withAuth(async (req: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const data = await req.json()

    // Verificar que la solicitud existe y pertenece al usuario
    const existingSolicitud = await prisma.solicitud.findUnique({
      where: { id: params.id },
      include: { programa: true },
    })

    if (!existingSolicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
    }

    // Verificar permisos
    if (user.role === "INSTRUCTOR" && existingSolicitud.instructorId !== user.userId) {
      return NextResponse.json({ error: "No tienes permisos para editar esta solicitud" }, { status: 403 })
    }

    // Solo permitir edición si está en borrador o pendiente
    if (!["BORRADOR", "PENDIENTE"].includes(existingSolicitud.estado)) {
      return NextResponse.json({ error: "No se puede editar una solicitud en este estado" }, { status: 400 })
    }

    // Actualizar solicitud
    const solicitud = await prisma.solicitud.update({
      where: { id: params.id },
      data: {
        fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : undefined,
        fechaFin: data.fechaFin ? new Date(data.fechaFin) : undefined,
        numeroAprendices: data.numeroAprendices,
        justificacion: data.justificacion,
        objetivosPersonalizados: data.objetivosPersonalizados,
        resultadosEsperados: data.resultadosEsperados,
        metodologia: data.metodologia,
        recursosNecesarios: data.recursosNecesarios,
        criteriosEvaluacion: data.criteriosEvaluacion,
        observaciones: data.observaciones,
        cumpleRequisitos: data.cumpleRequisitos,
        autorizaUsoInfo: data.autorizaUsoInfo,
        confirmaVeracidad: data.confirmaVeracidad,
        estado: data.isDraft ? "BORRADOR" : "PENDIENTE",
      },
      include: {
        programa: { select: { nombre: true } },
        horarios: true,
      },
    })

    // Actualizar horarios si se proporcionan
    if (data.horarios) {
      await prisma.horarioSolicitud.deleteMany({
        where: { solicitudId: params.id },
      })

      await prisma.horarioSolicitud.createMany({
        data: data.horarios.map((horario: any) => ({
          solicitudId: params.id,
          diaSemana: horario.diaSemana,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
        })),
      })
    }

    return NextResponse.json({
      message: "Solicitud actualizada exitosamente",
      solicitud,
    })
  } catch (error) {
    console.error("Error actualizando solicitud:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
