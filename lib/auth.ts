import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

export interface JWTPayload {
  userId: string
  email: string
  role: string
  centroId: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { centro: true },
  })

  if (!user || !user.isActive) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    return null
  }

  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    centroId: user.centroId,
  }

  const token = generateToken(payload)

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      centro: user.centro.nombre,
      especialidad: user.especialidad,
    },
    token,
  }
}
