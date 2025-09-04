import { type NextRequest, NextResponse } from "next/server"
import { withRole } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const POST = withRole(["COORDINADOR", "ADMIN"])(
  async (req: NextRequest, user, { params }: { params: { id: string } }) => {
    try {
      const { comentarios } = await req.json()

      if (!comentarios || comentarios.trim().length === 0) {
        return NextResponse.json(
          { error: "Los comentarios son requeridos para rechazar una solicitud" },
          { status: 400 },
        )
      }

      const solicitud = await prisma.solicitud.findUnique({
        where: { id: params.id },
        include: { programa: true },
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
        where: { id: params.id },
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
