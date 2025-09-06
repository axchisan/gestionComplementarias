import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const leidas = searchParams.get("leidas")

    const where: any = {
      usuarioId: user.userId,
    }

    if (leidas !== null) {
      where.leida = leidas === "true"
    }

    const [notificaciones, total, noLeidas] = await Promise.all([
      prisma.notificacion.findMany({
        where,
        include: {
          solicitud: {
            select: {
              codigo: true,
              programa: {
                select: { nombre: true },
              },
            },
          },
        },
        orderBy: { fechaCreada: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notificacion.count({ where }),
      prisma.notificacion.count({
        where: {
          usuarioId: user.userId,
          leida: false,
        },
      }),
    ])

    return NextResponse.json({
      notificaciones,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      noLeidas,
    })
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const data = await req.json()

    const notificacion = await prisma.notificacion.create({
      data: {
        tipo: data.tipo,
        titulo: data.titulo,
        mensaje: data.mensaje,
        usuarioId: data.usuarioId,
        solicitudId: data.solicitudId,
      },
    })

    return NextResponse.json({ notificacion }, { status: 201 })
  } catch (error) {
    console.error("Error creando notificación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
