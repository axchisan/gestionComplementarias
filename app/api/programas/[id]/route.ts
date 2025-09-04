import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user, context) => {
  try {
    const { params } = context || {}
    if (!params?.id) {
      return NextResponse.json({ error: "ID de programa requerido" }, { status: 400 })
    }

    const programa = await prisma.programa.findUnique({
      where: { id: params.id },
      include: {
        centro: {
          select: { nombre: true, codigo: true, ciudad: true },
        },
        objetivos: {
          orderBy: { orden: "asc" },
        },
        competencias: true,
        resultados: true,
        _count: {
          select: { solicitudes: true },
        },
      },
    })

    if (!programa) {
      return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 })
    }

    // Verificar permisos si es instructor
    if (user.role === "INSTRUCTOR" && programa.centroId !== user.centroId) {
      return NextResponse.json({ error: "No tienes permisos para ver este programa" }, { status: 403 })
    }

    return NextResponse.json({ programa })
  } catch (error) {
    console.error("Error obteniendo programa:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
