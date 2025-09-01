"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Save, AlertCircle, CheckCircle } from "lucide-react"

interface InstructorData {
  nombres: string
  apellidos: string
  cedula: string
  email: string
  telefono: string
  especialidad: string
  fechaIngreso: string
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

export function RegistrarInstructorForm() {
  const coordinador = {
    centro: "Centro de Gestión Agroempresarial del Oriente",
  }

  const [formData, setFormData] = useState<InstructorData>({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    especialidad: "",
    fechaIngreso: new Date().toISOString().split("T")[0],
    observaciones: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof InstructorData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Instructor registrado:", { ...formData, centro: coordinador.centro })
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
          fechaIngreso: new Date().toISOString().split("T")[0],
          observaciones: "",
        })
      }, 3000)
    } catch (err) {
      setError("Error al registrar el instructor. Por favor, intenta nuevamente.")
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Instructor Registrado Exitosamente!</h3>
          <p className="text-gray-600 mb-4">
            El instructor ha sido registrado en el sistema. El administrador creará sus credenciales de acceso.
          </p>
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              <strong>Instructor:</strong> {formData.nombres} {formData.apellidos}
            </p>
            <p className="text-sm text-green-700">
              <strong>Especialidad:</strong> {formData.especialidad}
            </p>
            <p className="text-sm text-green-700">
              <strong>Centro:</strong> {coordinador.centro}
            </p>
          </div>
          <div className="flex space-x-3 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Registrar Otro Instructor</Button>
            <Button variant="outline">Ver Lista de Instructores</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-900 flex items-center justify-center space-x-2">
          <UserPlus className="h-6 w-6 text-blue-600" />
          <span>Registrar Nuevo Instructor</span>
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Registra un instructor para {coordinador.centro}
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
                    • El instructor será registrado en tu centro: <strong>{coordinador.centro}</strong>
                  </li>
                  <li>• Las credenciales de acceso serán creadas por el administrador del sistema</li>
                  <li>• El instructor recibirá sus credenciales por correo electrónico</li>
                  <li>• Podrás asignar fichas de formación una vez que tenga acceso al sistema</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Información Personal</h3>

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
              <p className="text-xs text-gray-500">Debe ser un correo electrónico institucional del SENA</p>
            </div>
          </div>

          {/* Información Académica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Información Académica</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="especialidad" className="text-sm font-medium text-gray-700">
                  Especialidad/Área de Conocimiento *
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

              <div className="space-y-2">
                <label htmlFor="fechaIngreso" className="text-sm font-medium text-gray-700">
                  Fecha de Ingreso *
                </label>
                <Input
                  id="fechaIngreso"
                  type="date"
                  value={formData.fechaIngreso}
                  onChange={(e) => handleInputChange("fechaIngreso", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Centro de Formación</label>
              <Input value={coordinador.centro} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500">El instructor será asignado automáticamente a tu centro</p>
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
                  <UserPlus className="mr-2 h-5 w-5 animate-pulse" />
                  Registrando instructor...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Registrar Instructor
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
