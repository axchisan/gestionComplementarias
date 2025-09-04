"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, Shield, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof LoginData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe)

      if (result.success) {
        // Redirect to dashboard
        router.push("/")
      } else {
        setError(result.error || "Credenciales incorrectas. Verifica tu correo electrónico y contraseña.")
      }
    } catch (err) {
      setError("Error de conexión. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (userType: "instructor" | "coordinador" | "admin") => {
    const credentials = {
      instructor: { email: "maria.gonzalez@sena.edu.co", password: "sena123" },
      coordinador: { email: "luis.herrera@sena.edu.co", password: "sena123" },
      admin: { email: "admin@sena.edu.co", password: "sena123" },
    }

    const cred = credentials[userType]
    setFormData((prev) => ({
      ...prev,
      email: cred.email,
      password: cred.password,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Demo Credentials Helper */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Credenciales de Demostración</h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("instructor")}
                  className="text-left text-xs text-blue-700 hover:text-blue-900 bg-white/50 hover:bg-white/80 p-2 rounded transition-colors"
                >
                  <div className="font-medium">👨‍🏫 Instructor</div>
                  <div className="text-blue-600">maria.gonzalez@sena.edu.co / sena123</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("coordinador")}
                  className="text-left text-xs text-blue-700 hover:text-blue-900 bg-white/50 hover:bg-white/80 p-2 rounded transition-colors"
                >
                  <div className="font-medium">👨‍💼 Coordinador</div>
                  <div className="text-blue-600">luis.herrera@sena.edu.co / sena123</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("admin")}
                  className="text-left text-xs text-blue-700 hover:text-blue-900 bg-white/50 hover:bg-white/80 p-2 rounded transition-colors"
                >
                  <div className="font-medium">⚙️ Administrador</div>
                  <div className="text-blue-600">admin@sena.edu.co / sena123</div>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información para Instructores */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-amber-900 mb-1">¿Eres instructor y no tienes acceso?</h4>
              <p className="text-xs text-amber-700">
                Las credenciales de acceso son creadas por tu coordinador o administrador del centro. Si necesitas
                acceso al sistema, contacta a tu coordinador académico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo Electrónico Institucional
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="tu.nombre@sena.edu.co"
              className="pl-10 h-12"
              required
              disabled={isLoading || authLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="pl-10 pr-10 h-12"
              required
              disabled={isLoading || authLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading || authLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
              disabled={isLoading || authLoading}
            />
            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
              Recordar sesión
            </label>
          </div>
          <button
            type="button"
            className="text-sm text-green-600 hover:text-green-500 transition-colors"
            disabled={isLoading || authLoading}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold"
          disabled={isLoading || authLoading}
        >
          {isLoading || authLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>

      {/* Security Notice */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Seguridad</h4>
              <p className="text-xs text-gray-600 mt-1">
                Tu sesión está protegida con encriptación SSL. Nunca compartas tus credenciales.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
