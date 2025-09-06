import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const PUT = withAuth(async (req: NextRequest, user, context) => {
  try {
    const { params } = context || {}
    if (!params) {
      return NextResponse.json({ error: "Parámetros no disponibles" }, { status: 400 })
    }

    const resolvedParams = await params
    if (!resolvedParams?.id) {
      return NextResponse.json({ error: "ID de notificación requerido" }, { status: 400 })
    }

    const notificacion = await prisma.notificacion.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!notificacion) {
      return NextResponse.json({ error: "Notificación no encontrada" }, { status: 404 })
    }

    if (notificacion.usuarioId !== user.userId) {
      return NextResponse.json({ error: "No tienes permisos para esta notificación" }, { status: 403 })
    }

    const notificacionActualizada = await prisma.notificacion.update({
      where: { id: resolvedParams.id },
      data: { leida: true },
    })

    return NextResponse.json({ notificacion: notificacionActualizada })
  } catch (error) {
    console.error("Error marcando notificación como leída:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
