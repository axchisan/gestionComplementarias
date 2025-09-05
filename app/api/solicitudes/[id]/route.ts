import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user, context) => {
  try {
    const { params } = context || {}
    if (!params) {
      return NextResponse.json({ error: "Parámetros no disponibles" }, { status: 400 })
    }

    // Await params before accessing properties (Next.js 15 requirement)
    const resolvedParams = await params
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "ID de solicitud requerido" }, { status: 400 })
    }

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: resolvedParams.id },
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

export const PUT = withAuth(async (req: NextRequest, user, context) => {
  try {
    const { params } = context || {}
    if (!params) {
      return NextResponse.json({ error: "Parámetros no disponibles" }, { status: 400 })
    }

    // Await params before accessing properties (Next.js 15 requirement)
    const resolvedParams = await params
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "ID de solicitud requerido" }, { status: 400 })
    }

    const data = await req.json()

    // Verificar que la solicitud existe y pertenece al usuario
    const existingSolicitud = await prisma.solicitud.findUnique({
      where: { id: resolvedParams.id },
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
      where: { id: resolvedParams.id },
      data: {
        // Información general
        fechaCaracterizacion: data.fechaCaracterizacion ? new Date(data.fechaCaracterizacion) : undefined,
        responsableNombre: data.responsableNombre,
        responsableCedula: data.responsableCedula,
        responsableEmail: data.responsableEmail,

        // Datos del programa
        codigoPrograma: data.codigoPrograma,
        versionPrograma: data.versionPrograma,
        duracionMaxima: data.duracionMaxima,
        cupoMaximo: data.cupoMaximo,
        numeroAprendicesInscribir: data.numeroAprendicesInscribir,
        modalidad: data.modalidad,

        // Datos de empresa y ubicación
        municipio: data.municipio,
        departamento: data.departamento,
        nombreEmpresa: data.nombreEmpresa,
        nitEmpresa: data.nitEmpresa,
        codigoEmpresa: data.codigoEmpresa,
        representanteLegal: data.representanteLegal,
        fechaCreacionEmpresa: data.fechaCreacionEmpresa ? new Date(data.fechaCreacionEmpresa) : undefined,
        direccionEmpresa: data.direccionEmpresa,
        telefonosEmpresa: data.telefonosEmpresa,

        // Ambiente de formación
        lugarFormacion: data.lugarFormacion,
        tipoAmbiente: data.tipoAmbiente,

        // Caracterización de programas especiales
        programaEmprendimiento: data.programaEmprendimiento,
        programaBilinguismo: data.programaBilinguismo,
        atencionInstituciones: data.atencionInstituciones,
        posconflicto: data.posconflicto,
        senaEmprendeRural: data.senaEmprendeRural,
        formacionEspecialMypimes: data.formacionEspecialMypimes,
        senaEmprendeRuralPosconflicto: data.senaEmprendeRuralPosconflicto,
        tecnoacademiaSennova: data.tecnoacademiaSennova,
        campesenaConvenio8842: data.campesenaConvenio8842,
        fullPopularConvenio8882: data.fullPopularConvenio8882,
        icbfInstituto: data.icbfInstituto,
        policiaNacional: data.policiaNacional,
        otroEspecificar: data.otroEspecificar,

        // Fechas de programación
        inicioInscripcion: data.inicioInscripcion ? new Date(data.inicioInscripcion) : undefined,
        finalizacionInscripcion: data.finalizacionInscripcion ? new Date(data.finalizacionInscripcion) : undefined,
        fechaInicioCurso: data.fechaInicioCurso ? new Date(data.fechaInicioCurso) : undefined,
        fechaFinalizacionCurso: data.fechaFinalizacionCurso ? new Date(data.fechaFinalizacionCurso) : undefined,

        // Justificación académica
        justificacion: data.justificacion,
        objetivosPersonalizados: data.objetivosPersonalizados,
        resultadosEsperados: data.resultadosEsperados,
        observaciones: data.observaciones,

        // Validaciones
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
      await prisma.horarioDetallado.deleteMany({
        where: { solicitudId: resolvedParams.id },
      })

      await prisma.horarioDetallado.createMany({
        data: data.horarios.map((horario: any) => ({
          solicitudId: resolvedParams.id,
          diaSemana: horario.diaSemana,
          fecha: horario.fecha ? new Date(horario.fecha) : null,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          esFlexible: horario.esFlexible !== undefined ? horario.esFlexible : true,
          observaciones: horario.observaciones,
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
