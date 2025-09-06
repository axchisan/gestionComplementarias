import { type NextRequest, NextResponse } from "next/server"
import { withRole } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import { NotificationService } from "@/lib/notification-service"

export const POST = withRole(["COORDINADOR", "ADMIN"])(
  async (req: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { comentarios } = await req.json()
      const { id } = await params

      if (!comentarios || comentarios.trim().length === 0) {
        return NextResponse.json(
          { error: "Los comentarios son requeridos para rechazar una solicitud" },
          { status: 400 },
        )
      }

      const solicitud = await prisma.solicitud.findUnique({
        where: { id },
        include: {
          programa: true,
          instructor: { select: { id: true, name: true, email: true } },
        },
      })

      if (!solicitud) {
        return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
      }

      // Verificar permisos del coordinador
      if (user.role === "COORDINADOR" && solicitud.programa.centroId !== user.centroId) {
        return NextResponse.json({ error: "No tienes permisos para rechazar esta solicitud" }, { status: 403 })
      }

      if (solicitud.estado !== "PENDIENTE" && solicitud.estado !== "EN_REVISION") {
        return NextResponse.json({ error: "La solicitud no está en un estado que permita rechazo" }, { status: 400 })
      }

      const solicitudRechazada = await prisma.solicitud.update({
        where: { id },
        data: {
          estado: "RECHAZADA",
          fechaRevision: new Date(),
          comentariosRevision: comentarios,
        },
        include: {
          instructor: { select: { name: true, email: true } },
          programa: { select: { nombre: true } },
        },
      })

      try {
        await NotificationService.notificarSolicitudRechazada(
          solicitud.id,
          solicitud.instructor.id,
          solicitud.codigo,
          comentarios,
        )
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Don't fail the rejection if notification fails
      }

      return NextResponse.json({
        message: "Solicitud rechazada",
        solicitud: solicitudRechazada,
      })
    } catch (error) {
      console.error("Error rechazando solicitud:", error)
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
  },
)
