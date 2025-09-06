import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import { NotificationService } from "@/lib/notification-service"

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
      include: {
        centro: {
          include: {
            usuarios: {
              where: { role: "COORDINADOR", isActive: true },
              select: { id: true, name: true },
            },
          },
        },
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

        // Información general
        fechaCaracterizacion: data.fechaCaracterizacion ? new Date(data.fechaCaracterizacion) : new Date(),
        responsableNombre: data.responsableNombre,
        responsableCedula: data.responsableCedula,
        responsableEmail: data.responsableEmail,

        // Datos del programa
        codigoPrograma: data.codigoPrograma,
        versionPrograma: data.versionPrograma || "1",
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
        fechaCreacionEmpresa: data.fechaCreacionEmpresa ? new Date(data.fechaCreacionEmpresa) : null,
        direccionEmpresa: data.direccionEmpresa,
        telefonosEmpresa: data.telefonosEmpresa,

        // Ambiente de formación
        lugarFormacion: data.lugarFormacion,
        tipoAmbiente: data.tipoAmbiente,

        // Caracterización de programas especiales
        programaEmprendimiento: data.programaEmprendimiento || false,
        programaBilinguismo: data.programaBilinguismo || false,
        atencionInstituciones: data.atencionInstituciones || false,
        posconflicto: data.posconflicto || false,
        senaEmprendeRural: data.senaEmprendeRural || false,
        formacionEspecialMypimes: data.formacionEspecialMypimes || false,
        senaEmprendeRuralPosconflicto: data.senaEmprendeRuralPosconflicto || false,
        tecnoacademiaSennova: data.tecnoacademiaSennova || false,
        campesenaConvenio8842: data.campesenaConvenio8842 || false,
        fullPopularConvenio8882: data.fullPopularConvenio8882 || false,
        icbfInstituto: data.icbfInstituto || false,
        policiaNacional: data.policiaNacional || false,
        otroEspecificar: data.otroEspecificar,

        // Fechas de programación
        inicioInscripcion: new Date(data.inicioInscripcion),
        finalizacionInscripcion: new Date(data.finalizacionInscripcion),
        fechaInicioCurso: new Date(data.fechaInicioCurso),
        fechaFinalizacionCurso: new Date(data.fechaFinalizacionCurso),

        // Justificación académica
        justificacion: data.justificacion,
        objetivosPersonalizados: data.objetivosPersonalizados || [],
        resultadosEsperados: data.resultadosEsperados,
        observaciones: data.observaciones,

        // Validaciones
        cumpleRequisitos: data.cumpleRequisitos || false,
        autorizaUsoInfo: data.autorizaUsoInfo || false,
        confirmaVeracidad: data.confirmaVeracidad || false,
        estado: data.isDraft ? "BORRADOR" : "PENDIENTE",

        horarios: {
          create:
            data.horarios?.map((horario: any) => ({
              diaSemana: horario.diaSemana,
              fecha: horario.fecha ? new Date(horario.fecha) : null,
              horaInicio: horario.horaInicio,
              horaFin: horario.horaFin,
              esFlexible: horario.esFlexible !== undefined ? horario.esFlexible : true,
              observaciones: horario.observaciones,
            })) || [],
        },
      },
      include: {
        programa: {
          select: { nombre: true, codigo: true },
        },
        horarios: true,
        instructor: {
          select: { name: true },
        },
      },
    })

    if (!data.isDraft && programa.centro.usuarios.length > 0) {
      try {
        // Notify all coordinators in the center
        const notificationPromises = programa.centro.usuarios.map((coordinador) =>
          NotificationService.notificarNuevaSolicitud(
            solicitud.id,
            coordinador.id,
            solicitud.instructor.name,
            solicitud.codigo,
          ),
        )
        await Promise.all(notificationPromises)
      } catch (notificationError) {
        console.error("Error creating notifications:", notificationError)
        // Don't fail the solicitud creation if notification fails
      }
    }

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
