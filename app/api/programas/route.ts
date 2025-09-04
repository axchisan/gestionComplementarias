import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export const GET = withAuth(async (req: NextRequest, user) => {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const tipoFormacion = searchParams.get("tipoFormacion")
    const modalidad = searchParams.get("modalidad")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {
      isActive: true,
      // Filtrar por centro del usuario si es instructor
      ...(user.role === "INSTRUCTOR" && { centroId: user.centroId }),
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { codigo: { contains: search, mode: "insensitive" } },
        { descripcion: { contains: search, mode: "insensitive" } },
      ]
    }

    if (tipoFormacion) {
      where.tipoFormacion = tipoFormacion
    }

    if (modalidad) {
      where.modalidad = modalidad
    }

    const [programas, total] = await Promise.all([
      prisma.programa.findMany({
        where,
        include: {
          centro: {
            select: { nombre: true, codigo: true },
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
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.programa.count({ where }),
    ])

    return NextResponse.json({
      programas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error obteniendo programas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
