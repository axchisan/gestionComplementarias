"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  cedula: string
  telefono?: string
  role: string
  especialidad?: string
  centro: {
    id: string
    nombre: string
    codigo: string
    ciudad: string
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = localStorage.getItem("sena_token")
    const storedUser = localStorage.getItem("sena_user")

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(userData)

        // Verify token with server
        verifyToken(storedToken)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        logout()
      }
    }

    setIsLoading(false)
  }, [])

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      })

      if (!response.ok) {
        throw new Error("Token verification failed")
      }

      const { user: userData } = await response.json()
      setUser(userData)
    } catch (error) {
      console.error("Token verification failed:", error)
      logout()
    }
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Error de autenticación" }
      }

      // Store token and user data
      setToken(data.token)
      setUser(data.user)

      localStorage.setItem("sena_token", data.token)
      localStorage.setItem("sena_user", JSON.stringify(data.user))

      if (rememberMe) {
        localStorage.setItem("sena_remember", "true")
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Error de conexión. Intenta nuevamente." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("sena_token")
    localStorage.removeItem("sena_user")
    localStorage.removeItem("sena_remember")
    router.push("/")
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
