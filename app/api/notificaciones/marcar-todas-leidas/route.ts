import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const PUT = withAuth(async (req: NextRequest, user) => {
  try {
    await prisma.notificacion.updateMany({
      where: {
        usuarioId: user.userId,
        leida: false,
      },
      data: { leida: true },
    })

    return NextResponse.json({ message: "Todas las notificaciones marcadas como leídas" })
  } catch (error) {
    console.error("Error marcando todas las notificaciones como leídas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
