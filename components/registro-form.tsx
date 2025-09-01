"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, FileText, Send, AlertCircle, CheckCircle } from "lucide-react"

interface RegistroData {
  nombres: string
  apellidos: string
  cedula: string
  email: string
  telefono: string
  centro: string
  cargo: string
  justificacion: string
  aceptaTerminos: boolean
  autorizaDatos: boolean
}

const centrosFormacion = [
  "Centro de Gestión Agroempresarial del Oriente",
  "Centro de Biotecnología Agropecuaria",
  "Centro de Comercio y Servicios",
  "Centro de Diseño y Metrología",
  "Centro de Electricidad, Electrónica y Telecomunicaciones",
  "Centro de Gestión Industrial",
  "Centro de Manufactura en Textiles y Cuero",
  "Centro de Servicios de Salud",
  "Centro de Tecnologías del Transporte",
]

export function RegistroForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegistroData>({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    centro: "",
    cargo: "",
    justificacion: "",
    aceptaTerminos: false,
    autorizaDatos: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof RegistroData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validaciones
    if (!formData.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones para continuar.")
      setIsLoading(false)
      return
    }

    if (!formData.autorizaDatos) {
      setError("Debes autorizar el tratamiento de datos personales para continuar.")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful registration
      console.log("Solicitud de registro enviada:", formData)
      setSuccess(true)

      // Redirect after success message
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError("Error al enviar la solicitud. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Solicitud Enviada Exitosamente!</h3>
          <p className="text-gray-600 mb-4">
            Tu solicitud de acceso ha sido enviada al equipo de administración. Recibirás una respuesta en tu correo
            electrónico dentro de las próximas 24-48 horas.
          </p>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              <strong>Número de solicitud:</strong> REG-{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm text-green-700">
              <strong>Correo de contacto:</strong> {formData.email}
            </p>
          </div>
          <p className="text-sm text-gray-500">Serás redirigido al login en unos segundos...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">Solicitud de Acceso</CardTitle>
        <CardDescription className="text-center text-gray-600">
          Complete el formulario para solicitar acceso al sistema
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Información Personal</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombres" className="text-sm font-medium text-gray-700">
                  Nombres *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="nombres"
                    value={formData.nombres}
                    onChange={(e) => handleInputChange("nombres", e.target.value)}
                    placeholder="Tus nombres"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="apellidos" className="text-sm font-medium text-gray-700">
                  Apellidos *
                </label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange("apellidos", e.target.value)}
                  placeholder="Tus apellidos"
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
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo Electrónico Institucional *
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
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500">Debe ser tu correo electrónico institucional del SENA</p>
            </div>
          </div>

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Información Laboral</h3>

            <div className="space-y-2">
              <label htmlFor="centro" className="text-sm font-medium text-gray-700">
                Centro de Formación *
              </label>
              <Select
                value={formData.centro}
                onValueChange={(value) => handleInputChange("centro", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu centro de formación" />
                </SelectTrigger>
                <SelectContent>
                  {centrosFormacion.map((centro) => (
                    <SelectItem key={centro} value={centro}>
                      {centro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="cargo" className="text-sm font-medium text-gray-700">
                Cargo/Función *
              </label>
              <Select
                value={formData.cargo}
                onValueChange={(value) => handleInputChange("cargo", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="coordinador">Coordinador Académico</SelectItem>
                  <SelectItem value="coordinador_centro">Coordinador de Centro</SelectItem>
                  <SelectItem value="subdirector">Subdirector</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="justificacion" className="text-sm font-medium text-gray-700">
                Justificación de la Solicitud *
              </label>
              <Textarea
                id="justificacion"
                value={formData.justificacion}
                onChange={(e) => handleInputChange("justificacion", e.target.value)}
                placeholder="Explica por qué necesitas acceso al sistema de formación complementaria..."
                rows={4}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">Describe brevemente tu rol y por qué necesitas acceso al sistema</p>
            </div>
          </div>

          {/* Términos y Condiciones */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Términos y Condiciones</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terminos"
                  checked={formData.aceptaTerminos}
                  onCheckedChange={(checked) => handleInputChange("aceptaTerminos", checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="terminos" className="text-sm text-gray-700 leading-relaxed">
                  Acepto los términos y condiciones de uso del sistema. Me comprometo a usar la plataforma únicamente
                  para fines institucionales y a mantener la confidencialidad de mis credenciales de acceso.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="datos"
                  checked={formData.autorizaDatos}
                  onCheckedChange={(checked) => handleInputChange("autorizaDatos", checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="datos" className="text-sm text-gray-700 leading-relaxed">
                  Autorizo el tratamiento de mis datos personales de acuerdo con la Ley 1581 de 2012 y las políticas de
                  privacidad del SENA. Los datos serán utilizados únicamente para la gestión del acceso al sistema y
                  comunicaciones relacionadas.
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
            disabled={isLoading || !formData.aceptaTerminos || !formData.autorizaDatos}
          >
            {isLoading ? (
              <>
                <Send className="mr-2 h-5 w-5 animate-pulse" />
                Enviando solicitud...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Enviar Solicitud
              </>
            )}
          </Button>
        </form>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Información Importante</h4>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Tu solicitud será revisada por el equipo de administración</li>
                <li>• Recibirás una respuesta en 24-48 horas hábiles</li>
                <li>• Solo personal autorizado del SENA puede acceder al sistema</li>
                <li>• Para dudas, contacta al soporte técnico</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
