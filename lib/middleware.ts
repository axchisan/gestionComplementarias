import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, type JWTPayload } from "./auth"

export function withAuth(handler: (req: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    try {
      const authHeader = req.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Token de autorización requerido" }, { status: 401 })
      }

      const token = authHeader.substring(7)
      const user = verifyToken(token)

      if (!user) {
        return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
      }

      return handler(req, user, context)
    } catch (error) {
      return NextResponse.json({ error: "Error de autenticación" }, { status: 401 })
    }
  }
}

export function withRole(roles: string[]) {
  return (handler: (req: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>) =>
    withAuth(async (req: NextRequest, user: JWTPayload, context?: any) => {
      if (!roles.includes(user.role)) {
        return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 })
      }
      return handler(req, user, context)
    })
}
