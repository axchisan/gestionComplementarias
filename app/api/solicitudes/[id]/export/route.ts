import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const GET = withAuth(async (req: NextRequest, user, context) => {
  try {
    const { params } = context || {}
    if (!params) {
      return NextResponse.json({ error: "Parámetros no disponibles" }, { status: 400 })
    }

    const resolvedParams = await params
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "ID de solicitud requerido" }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const format = searchParams.get("format") || "pdf"

    // Obtener la solicitud con todos los datos necesarios
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
      return NextResponse.json({ error: "No tienes permisos para exportar esta solicitud" }, { status: 403 })
    }

    if (user.role === "COORDINADOR" && solicitud.programa.centroId !== user.centroId) {
      return NextResponse.json({ error: "No tienes permisos para exportar esta solicitud" }, { status: 403 })
    }

    if (format === "pdf") {
      return await generatePDF(solicitud)
    } else if (format === "excel") {
      return await generateExcel(solicitud)
    } else {
      return NextResponse.json({ error: "Formato no soportado" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error exportando solicitud:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})

async function generatePDF(solicitud: any) {
  const doc = new jsPDF()

  // Header con logo SENA
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("SERVICIO NACIONAL DE APRENDIZAJE - SENA", 20, 20)
  doc.text("FICHA DE CARACTERIZACIÓN", 20, 30)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Centro: ${solicitud.programa.centro.nombre}`, 20, 40)
  doc.text(`Código de Ficha: ${solicitud.numeroFicha || "Pendiente"}`, 20, 50)
  doc.text(`Fecha: ${format(new Date(), "PPP", { locale: es })}`, 20, 60)

  // Información del programa
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("DATOS DEL PROGRAMA", 20, 80)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  let yPos = 90

  doc.text(`Nombre del Programa: ${solicitud.programa.nombre}`, 20, yPos)
  yPos += 10
  doc.text(`Código: ${solicitud.programa.codigo} - Versión: ${solicitud.versionPrograma}`, 20, yPos)
  yPos += 10
  doc.text(`Duración Máxima: ${solicitud.duracionMaxima} horas`, 20, yPos)
  yPos += 10
  doc.text(`Cupo Máximo: ${solicitud.cupoMaximo} aprendices`, 20, yPos)
  yPos += 10
  doc.text(`Modalidad: ${solicitud.modalidad}`, 20, yPos)
  yPos += 20

  // Información del instructor
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("RESPONSABLE DE LA CARACTERIZACIÓN", 20, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Nombre: ${solicitud.instructor.name}`, 20, yPos)
  yPos += 10
  doc.text(`C.C.: ${solicitud.instructor.cedula}`, 20, yPos)
  yPos += 10
  doc.text(`Email: ${solicitud.instructor.email}`, 20, yPos)
  yPos += 20

  // Datos de empresa
  if (solicitud.nombreEmpresa) {
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("DATOS DE LA EMPRESA", 20, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Empresa: ${solicitud.nombreEmpresa}`, 20, yPos)
    yPos += 10
    if (solicitud.nitEmpresa) {
      doc.text(`NIT: ${solicitud.nitEmpresa}`, 20, yPos)
      yPos += 10
    }
    doc.text(`Municipio: ${solicitud.municipio}`, 20, yPos)
    yPos += 10
    doc.text(`Departamento: ${solicitud.departamento}`, 20, yPos)
    yPos += 20
  }

  // Fechas de programación
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("PROGRAMACIÓN", 20, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Inicio Inscripción: ${format(new Date(solicitud.inicioInscripcion), "PPP", { locale: es })}`, 20, yPos)
  yPos += 10
  doc.text(`Fin Inscripción: ${format(new Date(solicitud.finalizacionInscripcion), "PPP", { locale: es })}`, 20, yPos)
  yPos += 10
  doc.text(`Inicio Curso: ${format(new Date(solicitud.fechaInicioCurso), "PPP", { locale: es })}`, 20, yPos)
  yPos += 10
  doc.text(`Fin Curso: ${format(new Date(solicitud.fechaFinalizacionCurso), "PPP", { locale: es })}`, 20, yPos)

  const pdfBuffer = doc.output("arraybuffer")

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="solicitud-${solicitud.codigo}.pdf"`,
    },
  })
}

async function generateExcel(solicitud: any) {
  const workbook = XLSX.utils.book_new()

  // Hoja 1: Información General
  const generalData = [
    ["FICHA DE CARACTERIZACIÓN - SENA"],
    [""],
    ["Código de Solicitud", solicitud.codigo],
    ["Número de Ficha", solicitud.numeroFicha || "Pendiente"],
    ["Estado", solicitud.estado],
    ["Fecha de Solicitud", format(new Date(solicitud.fechaSolicitud), "PPP", { locale: es })],
    [""],
    ["PROGRAMA DE FORMACIÓN"],
    ["Nombre", solicitud.programa.nombre],
    ["Código", solicitud.programa.codigo],
    ["Versión", solicitud.versionPrograma],
    ["Duración", `${solicitud.duracionMaxima} horas`],
    ["Modalidad", solicitud.modalidad],
    ["Cupo Máximo", solicitud.cupoMaximo],
    ["Aprendices a Inscribir", solicitud.numeroAprendicesInscribir],
    [""],
    ["INSTRUCTOR RESPONSABLE"],
    ["Nombre", solicitud.instructor.name],
    ["Cédula", solicitud.instructor.cedula],
    ["Email", solicitud.instructor.email],
    ["Centro", solicitud.instructor.centro.nombre],
  ]

  if (solicitud.nombreEmpresa) {
    generalData.push(
      [""],
      ["DATOS DE EMPRESA"],
      ["Nombre", solicitud.nombreEmpresa],
      ["NIT", solicitud.nitEmpresa || ""],
      ["Representante Legal", solicitud.representanteLegal || ""],
      ["Municipio", solicitud.municipio],
      ["Departamento", solicitud.departamento],
      ["Dirección", solicitud.direccionEmpresa || ""],
    )
  }

  const generalSheet = XLSX.utils.aoa_to_sheet(generalData)
  XLSX.utils.book_append_sheet(workbook, generalSheet, "Información General")

  // Hoja 2: Horarios
  if (solicitud.horarios.length > 0) {
    const horariosData = [["HORARIOS DE FORMACIÓN"], [""], ["Día", "Hora Inicio", "Hora Fin", "Fecha", "Observaciones"]]

    solicitud.horarios.forEach((horario: any) => {
      horariosData.push([
        horario.diaSemana,
        horario.horaInicio,
        horario.horaFin,
        horario.fecha ? format(new Date(horario.fecha), "PPP", { locale: es }) : "",
        horario.observaciones || "",
      ])
    })

    const horariosSheet = XLSX.utils.aoa_to_sheet(horariosData)
    XLSX.utils.book_append_sheet(workbook, horariosSheet, "Horarios")
  }

  // Hoja 3: Objetivos y Competencias
  if (solicitud.programa.objetivos.length > 0 || solicitud.programa.competencias.length > 0) {
    const objetivosData = [["OBJETIVOS Y COMPETENCIAS"], [""], ["OBJETIVOS DE APRENDIZAJE"], ["Orden", "Descripción"]]

    solicitud.programa.objetivos.forEach((objetivo: any) => {
      objetivosData.push([objetivo.orden, objetivo.descripcion])
    })

    objetivosData.push([""], ["COMPETENCIAS"], ["Código", "Descripción"])

    solicitud.programa.competencias.forEach((competencia: any) => {
      objetivosData.push([competencia.codigo || "", competencia.descripcion])
    })

    const objetivosSheet = XLSX.utils.aoa_to_sheet(objetivosData)
    XLSX.utils.book_append_sheet(workbook, objetivosSheet, "Objetivos y Competencias")
  }

  const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(excelBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="solicitud-${solicitud.codigo}.xlsx"`,
    },
  })
}
