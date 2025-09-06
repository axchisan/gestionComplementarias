import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import * as XLSX from "xlsx"

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    if (user.role !== "COORDINADOR" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "No tienes permisos para importar instructores" }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const resultados = {
      exitosos: 0,
      errores: [] as Array<{ fila: number; error: string; datos: any }>,
      instructores: [] as Array<any>,
    }

    // Validar estructura del archivo
    const requiredColumns = ["nombres", "apellidos", "cedula", "email", "telefono", "especialidad"]
    const firstRow = data[0] as any

    if (!firstRow || !requiredColumns.every((col) => col in firstRow)) {
      return NextResponse.json(
        {
          error: `El archivo debe contener las columnas: ${requiredColumns.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Procesar cada fila
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any
      const filaNumero = i + 2 // +2 porque Excel empieza en 1 y hay header

      try {
        // Validaciones básicas
        if (!row.nombres || !row.apellidos || !row.cedula || !row.email) {
          resultados.errores.push({
            fila: filaNumero,
            error: "Faltan campos obligatorios (nombres, apellidos, cedula, email)",
            datos: row,
          })
          continue
        }

        // Validar email institucional
        if (!row.email.endsWith("@sena.edu.co") && !row.email.endsWith("@misena.edu.co")) {
          resultados.errores.push({
            fila: filaNumero,
            error: "Debe usar un correo electrónico institucional del SENA",
            datos: row,
          })
          continue
        }

        // Verificar si ya existe
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: row.email }, { cedula: row.cedula.toString() }],
          },
        })

        if (existingUser) {
          resultados.errores.push({
            fila: filaNumero,
            error: "Ya existe un usuario con este email o cédula",
            datos: row,
          })
          continue
        }

        // Generar contraseña temporal
        const tempPassword = `SENA${row.cedula.toString().slice(-4)}${new Date().getFullYear()}`
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        // Crear instructor
        const instructor = await prisma.user.create({
          data: {
            name: `${row.nombres} ${row.apellidos}`,
            email: row.email,
            password: hashedPassword,
            cedula: row.cedula.toString(),
            telefono: row.telefono?.toString() || "",
            especialidad: row.especialidad || "",
            role: "INSTRUCTOR",
            centroId: user.centroId,
            isActive: true,
          },
          include: {
            centro: {
              select: { nombre: true },
            },
          },
        })

        resultados.exitosos++
        resultados.instructores.push({
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          cedula: instructor.cedula,
          credencialTemporal: tempPassword,
        })
      } catch (error) {
        console.error(`Error procesando fila ${filaNumero}:`, error)
        resultados.errores.push({
          fila: filaNumero,
          error: "Error interno al procesar la fila",
          datos: row,
        })
      }
    }

    return NextResponse.json({
      message: `Importación completada. ${resultados.exitosos} instructores creados, ${resultados.errores.length} errores`,
      resultados,
    })
  } catch (error) {
    console.error("Error en importación masiva:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
})
