import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const result = await authenticateUser(email, password)

    if (!result) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login exitoso",
      user: result.user,
      token: result.token,
    })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
