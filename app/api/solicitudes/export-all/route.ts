import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    const { searchParams } = new URL(req.url)
    const exportFormat = searchParams.get("format") || "excel"
    const estado = searchParams.get("estado")
    const fechaInicio = searchParams.get("fechaInicio")
    const fechaFin = searchParams.get("fechaFin")

    // Construir filtros
    const where: any = {}

    // Filtrar por rol
    if (user.role === "INSTRUCTOR") {
      where.instructorId = user.userId
    } else if (user.role === "COORDINADOR") {
      where.programa = {
        centroId: user.centroId,
      }
    }

    // Filtros adicionales
    if (estado) {
      if (estado.includes(",")) {
        const estados = estado.split(",").map((e) => e.trim().toUpperCase())
        where.estado = { in: estados }
      } else {
        where.estado = estado.toUpperCase()
      }
    }

    if (fechaInicio && fechaFin) {
      where.fechaSolicitud = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      }
    }

    // Obtener todas las solicitudes
    const solicitudes = await prisma.solicitud.findMany({
      where,
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
      orderBy: { fechaSolicitud: "desc" },
    })

    if (solicitudes.length === 0) {
      return NextResponse.json({ error: "No se encontraron solicitudes para exportar" }, { status: 404 })
    }

    if (exportFormat === "pdf") {
      return await generateBulkPDF(solicitudes, user)
    } else if (exportFormat === "excel") {
      return await generateBulkExcel(solicitudes, user)
    } else {
      return NextResponse.json({ error: "Formato no soportado" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error exportando solicitudes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})

async function generateBulkPDF(solicitudes: any[], user: any) {
  const doc = new jsPDF()

  // Portada
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("REPORTE DE SOLICITUDES", 20, 30)
  doc.text("FORMACIÓN COMPLEMENTARIA", 20, 45)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Generado por: ${user.name}`, 20, 65)
  doc.text(`Fecha: ${format(new Date(), "PPP", { locale: es })}`, 20, 75)
  doc.text(`Total de solicitudes: ${solicitudes.length}`, 20, 85)

  // Estadísticas
  const stats = {
    BORRADOR: solicitudes.filter((s) => s.estado === "BORRADOR").length,
    PENDIENTE: solicitudes.filter((s) => s.estado === "PENDIENTE").length,
    APROBADA: solicitudes.filter((s) => s.estado === "APROBADA").length,
    RECHAZADA: solicitudes.filter((s) => s.estado === "RECHAZADA").length,
  }

  doc.text("ESTADÍSTICAS:", 20, 105)
  doc.text(`• Borradores: ${stats.BORRADOR}`, 25, 115)
  doc.text(`• Pendientes: ${stats.PENDIENTE}`, 25, 125)
  doc.text(`• Aprobadas: ${stats.APROBADA}`, 25, 135)
  doc.text(`• Rechazadas: ${stats.RECHAZADA}`, 25, 145)

  // Nueva página para el listado
  doc.addPage()

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("LISTADO DE SOLICITUDES", 20, 20)

  let yPos = 40
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  solicitudes.forEach((solicitud, index) => {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.setFont("helvetica", "bold")
    doc.text(`${index + 1}. ${solicitud.codigo} - ${solicitud.estado}`, 20, yPos)
    yPos += 8

    doc.setFont("helvetica", "normal")
    doc.text(`Programa: ${solicitud.programa.nombre}`, 25, yPos)
    yPos += 6
    doc.text(`Instructor: ${solicitud.instructor.name}`, 25, yPos)
    yPos += 6
    doc.text(`Centro: ${solicitud.programa.centro.nombre}`, 25, yPos)
    yPos += 6
    doc.text(`Fecha: ${format(new Date(solicitud.fechaSolicitud), "PPP", { locale: es })}`, 25, yPos)
    yPos += 12
  })

  const pdfBuffer = doc.output("arraybuffer")

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="reporte-solicitudes-${format(new Date(), "yyyy-MM-dd")}.pdf"`,
    },
  })
}

async function generateBulkExcel(solicitudes: any[], user: any) {
  const workbook = XLSX.utils.book_new()

  // Hoja 1: Resumen
  const resumenData = [
    ["REPORTE DE SOLICITUDES - FORMACIÓN COMPLEMENTARIA"],
    [""],
    ["Generado por", user.name],
    ["Fecha de generación", format(new Date(), "PPP", { locale: es })],
    ["Total de solicitudes", solicitudes.length],
    [""],
    ["ESTADÍSTICAS POR ESTADO"],
    ["Estado", "Cantidad", "Porcentaje"],
  ]

  const stats = {
    BORRADOR: solicitudes.filter((s) => s.estado === "BORRADOR").length,
    PENDIENTE: solicitudes.filter((s) => s.estado === "PENDIENTE").length,
    EN_REVISION: solicitudes.filter((s) => s.estado === "EN_REVISION").length,
    APROBADA: solicitudes.filter((s) => s.estado === "APROBADA").length,
    RECHAZADA: solicitudes.filter((s) => s.estado === "RECHAZADA").length,
  }

  Object.entries(stats).forEach(([estado, cantidad]) => {
    const porcentaje = solicitudes.length > 0 ? ((cantidad / solicitudes.length) * 100).toFixed(1) : "0"
    resumenData.push([estado, cantidad, `${porcentaje}%`])
  })

  const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData)
  XLSX.utils.book_append_sheet(workbook, resumenSheet, "Resumen")

  // Hoja 2: Listado Completo
  const listadoData = [
    [
      "Código",
      "Estado",
      "Programa",
      "Instructor",
      "Centro",
      "Fecha Solicitud",
      "Fecha Inicio Curso",
      "Duración (Horas)",
      "Modalidad",
      "Aprendices",
      "Municipio",
      "Departamento",
      "Empresa",
      "Justificación",
    ],
  ]

  solicitudes.forEach((solicitud) => {
    listadoData.push([
      solicitud.codigo,
      solicitud.estado,
      solicitud.programa.nombre,
      solicitud.instructor.name,
      solicitud.programa.centro.nombre,
      format(new Date(solicitud.fechaSolicitud), "PPP", { locale: es }),
      solicitud.fechaInicioCurso ? format(new Date(solicitud.fechaInicioCurso), "PPP", { locale: es }) : "",
      solicitud.duracionMaxima,
      solicitud.modalidad,
      solicitud.numeroAprendicesInscribir,
      solicitud.municipio || "",
      solicitud.departamento || "",
      solicitud.nombreEmpresa || "",
      solicitud.justificacion || "",
    ])
  })

  const listadoSheet = XLSX.utils.aoa_to_sheet(listadoData)
  XLSX.utils.book_append_sheet(workbook, listadoSheet, "Listado Completo")

  // Hoja 3: Análisis por Centro
  const centros = [...new Set(solicitudes.map((s) => s.programa.centro.nombre))]
  const centrosData = [
    ["ANÁLISIS POR CENTRO"],
    [""],
    ["Centro", "Total Solicitudes", "Aprobadas", "Pendientes", "Rechazadas"],
  ]

  centros.forEach((centro) => {
    const solicitudesCentro = solicitudes.filter((s) => s.programa.centro.nombre === centro)
    const aprobadas = solicitudesCentro.filter((s) => s.estado === "APROBADA").length
    const pendientes = solicitudesCentro.filter((s) => s.estado === "PENDIENTE").length
    const rechazadas = solicitudesCentro.filter((s) => s.estado === "RECHAZADA").length

    centrosData.push([centro, solicitudesCentro.length, aprobadas, pendientes, rechazadas])
  })

  const centrosSheet = XLSX.utils.aoa_to_sheet(centrosData)
  XLSX.utils.book_append_sheet(workbook, centrosSheet, "Análisis por Centro")

  // Hoja 4: Análisis por Instructor
  const instructores = [...new Set(solicitudes.map((s) => s.instructor.name))]
  const instructoresData = [
    ["ANÁLISIS POR INSTRUCTOR"],
    [""],
    ["Instructor", "Email", "Centro", "Total Solicitudes", "Aprobadas", "Pendientes"],
  ]

  instructores.forEach((instructorName) => {
    const solicitudesInstructor = solicitudes.filter((s) => s.instructor.name === instructorName)
    const instructor = solicitudesInstructor[0].instructor
    const aprobadas = solicitudesInstructor.filter((s) => s.estado === "APROBADA").length
    const pendientes = solicitudesInstructor.filter((s) => s.estado === "PENDIENTE").length

    instructoresData.push([
      instructorName,
      instructor.email,
      instructor.centro.nombre,
      solicitudesInstructor.length,
      aprobadas,
      pendientes,
    ])
  })

  const instructoresSheet = XLSX.utils.aoa_to_sheet(instructoresData)
  XLSX.utils.book_append_sheet(workbook, instructoresSheet, "Análisis por Instructor")

  const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(excelBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="reporte-solicitudes-${format(new Date(), "yyyy-MM-dd")}.xlsx"`,
    },
  })
}
