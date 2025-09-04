import { type NextRequest, NextResponse } from "next/server"
import { withRole } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const POST = withRole(["COORDINADOR", "ADMIN"])(
  async (req: NextRequest, user, { params }: { params: { id: string } }) => {
    try {
      const { comentarios } = await req.json()

      const solicitud = await prisma.solicitud.findUnique({
        where: { id: params.id },
        include: { programa: true },
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

      // Generar número de ficha
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
        const lastNumber = Number.parseInt(lastFicha.numeroFicha.slice(-3))
        nextFichaNumber = lastNumber + 1
      }

      const numeroFicha = `${year}${nextFichaNumber.toString().padStart(3, "0")}`

      const solicitudAprobada = await prisma.solicitud.update({
        where: { id: params.id },
        data: {
          estado: "APROBADA",
          fechaAprobacion: new Date(),
          comentariosRevision: comentarios,
          numeroFicha,
        },
        include: {
          instructor: { select: { name: true, email: true } },
          programa: { select: { nombre: true } },
        },
      })

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
