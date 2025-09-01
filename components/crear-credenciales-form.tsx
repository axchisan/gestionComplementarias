"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Save, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

interface CredencialesData {
  nombres: string
  apellidos: string
  cedula: string
  email: string
  telefono: string
  especialidad: string
  password: string
  confirmPassword: string
  observaciones: string
}

const especialidades = [
  "Análisis y Desarrollo de Software",
  "Gestión Empresarial",
  "Biotecnología Agropecuaria",
  "Diseño Gráfico",
  "Electricidad y Electrónica",
  "Mecánica Industrial",
  "Contabilidad y Finanzas",
  "Marketing Digital",
  "Logística Empresarial",
  "Salud Ocupacional",
]

export function CrearCredencialesForm() {
  const coordinador = {
    centro: "Centro de Gestión Agroempresarial del Oriente",
  }

  const [formData, setFormData] = useState<CredencialesData>({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    especialidad: "",
    password: "",
    confirmPassword: "",
    observaciones: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof CredencialesData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData((prev) => ({ ...prev, password, confirmPassword: password }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Credenciales creadas:", { ...formData, centro: coordinador.centro })
      setSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          nombres: "",
          apellidos: "",
          cedula: "",
          email: "",
          telefono: "",
          especialidad: "",
          password: "",
          confirmPassword: "",
          observaciones: "",
        })
      }, 3000)
    } catch (err) {
      setError("Error al crear las credenciales. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Credenciales Creadas Exitosamente!</h3>
          <p className="text-gray-600 mb-4">El instructor ya puede acceder al sistema con sus nuevas credenciales.</p>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              <strong>Instructor:</strong> {formData.nombres} {formData.apellidos}
            </p>
            <p className="text-sm text-green-700">
              <strong>Email:</strong> {formData.email}
            </p>
            <p className="text-sm text-green-700">
              <strong>Centro:</strong> {coordinador.centro}
            </p>
          </div>
          <div className="flex space-x-3 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Crear Más Credenciales</Button>
            <Button variant="outline">Enviar Credenciales por Email</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center space-x-2">
          <Key className="h-6 w-6 text-blue-600" />
          <span>Crear Credenciales de Acceso</span>
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Crea credenciales de acceso al sistema para un instructor de tu centro
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Información Importante */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Información Importante</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • Las credenciales serán para el centro: <strong>{coordinador.centro}</strong>
                  </li>
                  <li>• El instructor recibirá sus credenciales por correo electrónico</li>
                  <li>• Podrá acceder inmediatamente al sistema para gestionar solicitudes</li>
                  <li>• Se recomienda que cambie la contraseña en el primer acceso</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Información del Instructor
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombres" className="text-sm font-medium text-gray-700">
                  Nombres *
                </label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange("nombres", e.target.value)}
                  placeholder="Nombres del instructor"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="apellidos" className="text-sm font-medium text-gray-700">
                  Apellidos *
                </label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange("apellidos", e.target.value)}
                  placeholder="Apellidos del instructor"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="cedula" className="text-sm font-medium text-gray-700">
                  Cédula de Ciudadanía *
                </label>
                <Input
                  id="cedula"
                  value={formData.cedula}
                  onChange={(e) => handleInputChange("cedula", e.target.value)}
                  placeholder="Número de cédula"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                  Teléfono *
                </label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="+57 300 123 4567"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico Institucional *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="instructor@sena.edu.co"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">Este será su usuario para acceder al sistema</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="especialidad" className="text-sm font-medium text-gray-700">
                  Especialidad/Área *
                </label>
                <Select
                  value={formData.especialidad}
                  onValueChange={(value) => handleInputChange("especialidad", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidades.map((especialidad) => (
                      <SelectItem key={especialidad} value={especialidad}>
                        {especialidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Centro de Formación</label>
              <Input value={coordinador.centro} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500">El instructor será asignado automáticamente a tu centro</p>
            </div>
          </div>

          {/* Credenciales de Acceso */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Credenciales de Acceso
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={generatePassword} disabled={isLoading}>
                Generar Contraseña
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Contraseña del instructor"
                    className="pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Mínimo 8 caracteres</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirma la contraseña"
                    className="pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label htmlFor="observaciones" className="text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange("observaciones", e.target.value)}
              placeholder="Información adicional sobre el instructor..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Key className="mr-2 h-5 w-5 animate-pulse" />
                  Creando credenciales...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-5 w-5" />
                  Crear Credenciales
                </>
              )}
            </Button>

            <Button type="button" variant="outline" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Borrador
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
