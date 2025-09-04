import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        cedula: true,
        telefono: true,
        role: true,
        especialidad: true,
        centro: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            ciudad: true,
          },
        },
      },
    })

    if (!userData) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
