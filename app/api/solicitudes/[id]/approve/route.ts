import { type NextRequest, NextResponse } from "next/server"
import { withRole } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import { NotificationService } from "@/lib/notification-service"

export const POST = withRole(["COORDINADOR", "ADMIN"])(
  async (req: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { comentarios, numeroFicha } = await req.json()
      const { id } = await params

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
        return NextResponse.json({ error: "No tienes permisos para aprobar esta solicitud" }, { status: 403 })
      }

      if (solicitud.estado !== "PENDIENTE" && solicitud.estado !== "EN_REVISION") {
        return NextResponse.json({ error: "La solicitud no está en un estado que permita aprobación" }, { status: 400 })
      }

      let finalNumeroFicha = numeroFicha
      if (!finalNumeroFicha) {
        const year = new Date().getFullYear()
        const lastFicha = await prisma.solicitud.findFirst({
          where: {
            numeroFicha: { not: null },
            numeroFicha: { startsWith: year.toString() },
          },
          orderBy: { numeroFicha: "desc" },
        })

        let nextFichaNumber = 1
        if (lastFicha && lastFicha.numeroFicha) {
          const lastNumber = Number.parseInt(lastFicha.numeroFicha.slice(-4))
          nextFichaNumber = lastNumber + 1
        }

        finalNumeroFicha = `${year}${nextFichaNumber.toString().padStart(4, "0")}`
      }

      const existingFicha = await prisma.solicitud.findFirst({
        where: { numeroFicha: finalNumeroFicha },
      })

      if (existingFicha) {
        return NextResponse.json({ error: "El número de ficha ya existe" }, { status: 400 })
      }

      const solicitudAprobada = await prisma.solicitud.update({
        where: { id },
        data: {
          estado: "APROBADA",
          fechaAprobacion: new Date(),
          comentariosRevision: comentarios,
          numeroFicha: finalNumeroFicha,
        },
        include: {
          instructor: { select: { name: true, email: true } },
          programa: { select: { nombre: true } },
        },
      })

      try {
        await NotificationService.notificarSolicitudAprobada(
          solicitud.id,
          solicitud.instructor.id,
          solicitud.codigo,
          finalNumeroFicha,
        )
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Don't fail the approval if notification fails
      }

      return NextResponse.json({
        message: "Solicitud aprobada exitosamente",
        solicitud: solicitudAprobada,
      })
    } catch (error) {
      console.error("Error aprobando solicitud:", error)
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
  },
)
