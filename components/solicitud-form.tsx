"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, Send, FileText, Plus, X, Search, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"

interface Programa {
  id: string
  codigo: string
  nombre: string
  tipoFormacion: string
  modalidad: string
  duracionHoras: number
  cupoAprendices: number
  descripcion?: string
  centro: {
    nombre: string
    codigo: string
  }
  objetivos: Array<{
    id: string
    descripcion: string
    orden: number
  }>
  competencias: Array<{
    id: string
    descripcion: string
    codigo?: string
  }>
  resultados: Array<{
    id: string
    descripcion: string
    codigo?: string
  }>
}

interface HorarioSolicitud {
  diaSemana: string
  horaInicio: string
  horaFin: string
}

interface FormData {
  // Información del Programa Seleccionado
  programaId: string
  programaSeleccionado: Programa | null

  // Información del Curso (fechas y configuración)
  fechaInicio: Date | undefined
  fechaFin: Date | undefined
  numeroAprendices: number
  horarios: HorarioSolicitud[]

  // Justificación y Competencias
  justificacion: string
  objetivosPersonalizados: string[]
  resultadosEsperados: string

  // Recursos y Metodología
  recursosNecesarios: string
  metodologia: string
  criteriosEvaluacion: string
  observaciones: string

  // Validaciones
  cumpleRequisitos: boolean
  autorizaUsoInfo: boolean
  confirmaVeracidad: boolean
}

const DIAS_SEMANA = [
  { value: "LUNES", label: "Lunes" },
  { value: "MARTES", label: "Martes" },
  { value: "MIERCOLES", label: "Miércoles" },
  { value: "JUEVES", label: "Jueves" },
  { value: "VIERNES", label: "Viernes" },
  { value: "SABADO", label: "Sábado" },
  { value: "DOMINGO", label: "Domingo" },
]

const HORAS_DISPONIBLES = Array.from({ length: 13 }, (_, i) => {
  const hora = i + 6 // Desde las 6:00 hasta las 18:00
  return `${hora.toString().padStart(2, "0")}:00`
})

export function SolicitudForm() {
  const { user, token } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    programaId: "",
    programaSeleccionado: null,
    fechaInicio: undefined,
    fechaFin: undefined,
    numeroAprendices: 0,
    horarios: [],
    justificacion: "",
    objetivosPersonalizados: [""],
    resultadosEsperados: "",
    recursosNecesarios: "",
    metodologia: "",
    criteriosEvaluacion: "",
    observaciones: "",
    cumpleRequisitos: false,
    autorizaUsoInfo: false,
    confirmaVeracidad: false,
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [programas, setProgramas] = useState<Programa[]>([])
  const [loadingProgramas, setLoadingProgramas] = useState(false)
  const [searchPrograma, setSearchPrograma] = useState("")
  const [error, setError] = useState("")
  const totalSteps = 5

  useEffect(() => {
    if (user && token) {
      loadProgramas()
    }
  }, [user, token])

  const loadProgramas = async () => {
    setLoadingProgramas(true)
    try {
      const response = await fetch(`/api/programas?search=${searchPrograma}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProgramas(data.programas)
      } else {
        setError("Error al cargar los programas disponibles")
      }
    } catch (error) {
      setError("Error de conexión al cargar programas")
    } finally {
      setLoadingProgramas(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProgramaSelect = async (programaId: string) => {
    try {
      const response = await fetch(`/api/programas/${programaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          programaId,
          programaSeleccionado: data.programa,
          numeroAprendices: data.programa.cupoAprendices,
          horarios: [],
        }))
      }
    } catch (error) {
      setError("Error al cargar detalles del programa")
    }
  }

  const addHorario = () => {
    setFormData((prev) => ({
      ...prev,
      horarios: [...prev.horarios, { diaSemana: "LUNES", horaInicio: "08:00", horaFin: "12:00" }],
    }))
  }

  const updateHorario = (index: number, field: keyof HorarioSolicitud, value: string) => {
    setFormData((prev) => ({
      ...prev,
      horarios: prev.horarios.map((horario, i) => (i === index ? { ...horario, [field]: value } : horario)),
    }))
  }

  const removeHorario = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      horarios: prev.horarios.filter((_, i) => i !== index),
    }))
  }

  const calculateTotalHours = () => {
    return formData.horarios.reduce((total, horario) => {
      const inicio = Number.parseInt(horario.horaInicio.split(":")[0])
      const fin = Number.parseInt(horario.horaFin.split(":")[0])
      return total + (fin - inicio)
    }, 0)
  }

  const addArrayItem = (field: "objetivosPersonalizados") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const updateArrayItem = (field: "objetivosPersonalizados", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeArrayItem = (field: "objetivosPersonalizados", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return !!formData.programaSeleccionado
      case 2:
        return formData.fechaInicio && formData.fechaFin && formData.horarios.length > 0
      case 3:
        return formData.justificacion && formData.objetivosPersonalizados.some((obj) => obj.trim())
      case 4:
        return formData.metodologia && formData.criteriosEvaluacion
      case 5:
        return formData.cumpleRequisitos && formData.autorizaUsoInfo && formData.confirmaVeracidad
      default:
        return true
    }
  }

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true)
    setError("")

    try {
      const solicitudData = {
        programaId: formData.programaId,
        fechaInicio: formData.fechaInicio?.toISOString(),
        fechaFin: formData.fechaFin?.toISOString(),
        numeroAprendices: formData.numeroAprendices,
        horarios: formData.horarios,
        justificacion: formData.justificacion,
        objetivosPersonalizados: formData.objetivosPersonalizados.filter((obj) => obj.trim()),
        resultadosEsperados: formData.resultadosEsperados,
        metodologia: formData.metodologia,
        recursosNecesarios: formData.recursosNecesarios,
        criteriosEvaluacion: formData.criteriosEvaluacion,
        observaciones: formData.observaciones,
        cumpleRequisitos: formData.cumpleRequisitos,
        autorizaUsoInfo: formData.autorizaUsoInfo,
        confirmaVeracidad: formData.confirmaVeracidad,
        isDraft,
      }

      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(solicitudData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        if (!isDraft) {
          setTimeout(() => {
            window.location.href = "/mis-solicitudes"
          }, 2000)
        }
      } else {
        setError(data.error || "Error al enviar la solicitud")
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Selección de Programa", description: "Elige el programa de formación" },
    { number: 2, title: "Configuración de Horarios", description: "Define fechas y horarios" },
    { number: 3, title: "Justificación Académica", description: "Objetivos y justificación" },
    { number: 4, title: "Metodología y Recursos", description: "Planificación pedagógica" },
    { number: 5, title: "Validación y Envío", description: "Confirmaciones y envío final" },
  ]

  if (submitStatus === "success") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Enviada Exitosamente!</h2>
          <p className="text-gray-600 mb-6">
            Su solicitud de formación complementaria ha sido registrada y enviada para revisión. Recibirá una
            notificación por correo electrónico con el estado de su solicitud.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => (window.location.href = "/mis-solicitudes")}
              className="bg-green-600 hover:bg-green-700"
            >
              Ver Mis Solicitudes
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso del Formulario</span>
              <span className="text-sm text-gray-500">
                {currentStep} de {totalSteps}
              </span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                      currentStep >= step.number
                        ? "bg-green-600 text-white"
                        : currentStep === step.number - 1
                          ? "bg-green-100 text-green-600 border-2 border-green-600"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="mt-2 text-center max-w-24">
                    <p className="text-xs font-medium text-gray-900 leading-tight">{step.title}</p>
                    <p className="text-xs text-gray-500 hidden sm:block leading-tight">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 sm:mx-4 ${currentStep > step.number ? "bg-green-600" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>{steps[currentStep - 1].title}</span>
          </CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Selección de Programa */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Información del Instructor</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Nombre:</span>
                    <p className="text-blue-700">{user?.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Centro:</span>
                    <p className="text-blue-700">{user?.centro?.nombre}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Email:</span>
                    <p className="text-blue-700">{user?.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Especialidad:</span>
                    <p className="text-blue-700">{user?.especialidad || "No especificada"}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Programa de Formación *</label>
                <div className="flex space-x-2 mb-4">
                  <Input
                    value={searchPrograma}
                    onChange={(e) => setSearchPrograma(e.target.value)}
                    placeholder="Buscar por nombre o código del programa..."
                    className="flex-1"
                  />
                  <Button onClick={loadProgramas} disabled={loadingProgramas}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {loadingProgramas ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Cargando programas...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {programas.map((programa) => (
                      <Card
                        key={programa.id}
                        className={`cursor-pointer transition-colors ${
                          formData.programaId === programa.id
                            ? "border-green-500 bg-green-50"
                            : "hover:border-green-300"
                        }`}
                        onClick={() => handleProgramaSelect(programa.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{programa.nombre}</h4>
                              <p className="text-sm text-gray-600 mt-1">{programa.descripcion}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>Código: {programa.codigo}</span>
                                <span>Duración: {programa.duracionHoras}h</span>
                                <span>Cupo: {programa.cupoAprendices}</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <Badge variant="secondary">{programa.tipoFormacion}</Badge>
                              <Badge variant="outline">{programa.modalidad}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {formData.programaSeleccionado && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Programa Seleccionado</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Nombre:</strong> {formData.programaSeleccionado.nombre}
                      </p>
                      <p>
                        <strong>Código:</strong> {formData.programaSeleccionado.codigo}
                      </p>
                      <p>
                        <strong>Duración:</strong> {formData.programaSeleccionado.duracionHoras} horas
                      </p>
                      <p>
                        <strong>Modalidad:</strong> {formData.programaSeleccionado.modalidad}
                      </p>
                      <p>
                        <strong>Cupo máximo:</strong> {formData.programaSeleccionado.cupoAprendices} aprendices
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Configuración de Horarios */}
          {currentStep === 2 && formData.programaSeleccionado && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fechaInicio
                          ? format(formData.fechaInicio, "PPP", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.fechaInicio}
                        onSelect={(date) => handleInputChange("fechaInicio", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Finalización *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fechaFin ? format(formData.fechaFin, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.fechaFin}
                        onSelect={(date) => handleInputChange("fechaFin", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Aprendices *</label>
                  <Input
                    type="number"
                    value={formData.numeroAprendices}
                    onChange={(e) => handleInputChange("numeroAprendices", Number.parseInt(e.target.value) || 0)}
                    max={formData.programaSeleccionado.cupoAprendices}
                    min={1}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo: {formData.programaSeleccionado.cupoAprendices} aprendices
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Horarios de Clase *</label>
                  <Button onClick={addHorario} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Horario
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.horarios.map((horario, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-4 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
                          <Select
                            value={horario.diaSemana}
                            onValueChange={(value) => updateHorario(index, "diaSemana", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DIAS_SEMANA.map((dia) => (
                                <SelectItem key={dia.value} value={dia.value}>
                                  {dia.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
                          <Select
                            value={horario.horaInicio}
                            onValueChange={(value) => updateHorario(index, "horaInicio", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {HORAS_DISPONIBLES.map((hora) => (
                                <SelectItem key={hora} value={hora}>
                                  {hora}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
                          <Select
                            value={horario.horaFin}
                            onValueChange={(value) => updateHorario(index, "horaFin", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {HORAS_DISPONIBLES.map((hora) => (
                                <SelectItem key={hora} value={hora}>
                                  {hora}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Button
                            onClick={() => removeHorario(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {formData.horarios.length > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Total de horas semanales: {calculateTotalHours()} horas
                          </p>
                          <p className="text-xs text-blue-700">
                            Duración del programa: {formData.programaSeleccionado.duracionHoras} horas
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Justificación Académica */}
          {currentStep === 3 && formData.programaSeleccionado && (
            <div className="space-y-6">
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Objetivos y Competencias del Programa</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Objetivos de Aprendizaje:</h4>
                      <ul className="space-y-1">
                        {formData.programaSeleccionado.objetivos.map((objetivo) => (
                          <li key={objetivo.id} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            {objetivo.descripcion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Competencias:</h4>
                      <ul className="space-y-1">
                        {formData.programaSeleccionado.competencias.map((competencia) => (
                          <li key={competencia.id} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            {competencia.descripcion}
                            {competencia.codigo && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {competencia.codigo}
                              </Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Resultados de Aprendizaje:</h4>
                      <ul className="space-y-1">
                        {formData.programaSeleccionado.resultados.map((resultado) => (
                          <li key={resultado.id} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            {resultado.descripcion}
                            {resultado.codigo && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {resultado.codigo}
                              </Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Justificación de la Solicitud *</label>
                <Textarea
                  value={formData.justificacion}
                  onChange={(e) => handleInputChange("justificacion", e.target.value)}
                  placeholder="Explique las razones académicas y técnicas por las cuales solicita esta formación complementaria. Incluya la relevancia para el programa de formación y las necesidades identificadas en los aprendices..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivos Adicionales (Opcionales)
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Agregue objetivos específicos adicionales que complementen los objetivos del programa.
                </p>
                <div className="space-y-3">
                  {formData.objetivosPersonalizados.map((objetivo, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={objetivo}
                        onChange={(e) => updateArrayItem("objetivosPersonalizados", index, e.target.value)}
                        placeholder={`Objetivo adicional ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.objetivosPersonalizados.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("objetivosPersonalizados", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("objetivosPersonalizados")}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar Objetivo</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultados de Aprendizaje Esperados Adicionales
                </label>
                <Textarea
                  value={formData.resultadosEsperados}
                  onChange={(e) => handleInputChange("resultadosEsperados", e.target.value)}
                  placeholder="Describa resultados específicos adicionales que espera alcanzar con los aprendices al finalizar esta formación complementaria..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* ... existing code for steps 4 and 5 ... */}
          {/* Step 4: Metodología y Recursos */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metodología de Enseñanza *</label>
                <Textarea
                  value={formData.metodologia}
                  onChange={(e) => handleInputChange("metodologia", e.target.value)}
                  placeholder="Describa la metodología pedagógica que utilizará: clases magistrales, talleres prácticos, proyectos, estudios de caso, etc..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recursos Técnicos y Materiales Necesarios
                </label>
                <Textarea
                  value={formData.recursosNecesarios}
                  onChange={(e) => handleInputChange("recursosNecesarios", e.target.value)}
                  placeholder="Especifique los recursos técnicos, materiales, software, equipos o espacios necesarios para el desarrollo del programa..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Criterios y Métodos de Evaluación *
                </label>
                <Textarea
                  value={formData.criteriosEvaluacion}
                  onChange={(e) => handleInputChange("criteriosEvaluacion", e.target.value)}
                  placeholder="Describa cómo evaluará el aprendizaje: exámenes, proyectos, presentaciones, evaluación práctica, porcentajes, etc..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones Adicionales</label>
                <Textarea
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Información adicional relevante para la solicitud: horarios especiales, requerimientos específicos, coordinaciones necesarias..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 5: Validación y Envío */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Validaciones Requeridas
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="cumpleRequisitos"
                      checked={formData.cumpleRequisitos}
                      onCheckedChange={(checked) => handleInputChange("cumpleRequisitos", checked)}
                    />
                    <label htmlFor="cumpleRequisitos" className="text-sm text-gray-700 leading-relaxed">
                      <strong>Cumplimiento de Requisitos:</strong> Confirmo que cumplo con todos los requisitos
                      establecidos por el SENA para solicitar formación complementaria y que tengo la competencia
                      técnica necesaria para impartir este programa.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="autorizaUsoInfo"
                      checked={formData.autorizaUsoInfo}
                      onCheckedChange={(checked) => handleInputChange("autorizaUsoInfo", checked)}
                    />
                    <label htmlFor="autorizaUsoInfo" className="text-sm text-gray-700 leading-relaxed">
                      <strong>Autorización de Datos:</strong> Autorizo el uso de mi información personal para los fines
                      relacionados con esta solicitud de formación, de acuerdo con las políticas de privacidad y
                      protección de datos del SENA.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="confirmaVeracidad"
                      checked={formData.confirmaVeracidad}
                      onCheckedChange={(checked) => handleInputChange("confirmaVeracidad", checked)}
                    />
                    <label htmlFor="confirmaVeracidad" className="text-sm text-gray-700 leading-relaxed">
                      <strong>Veracidad de la Información:</strong> Declaro bajo la gravedad del juramento que toda la
                      información proporcionada en esta solicitud es veraz, completa y actualizada.
                    </label>
                  </div>
                </div>
              </div>

              {/* Resumen de la Solicitud */}
              {formData.programaSeleccionado && (
                <div className="p-6 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Resumen de la Solicitud
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Instructor:</span>
                        <p className="text-gray-600">{user?.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Programa:</span>
                        <p className="text-gray-600">{formData.programaSeleccionado.nombre}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Código:</span>
                        <p className="text-gray-600">{formData.programaSeleccionado.codigo}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Duración:</span>
                        <p className="text-gray-600">{formData.programaSeleccionado.duracionHoras} horas</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Modalidad:</span>
                        <p className="text-gray-600">{formData.programaSeleccionado.modalidad}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Aprendices:</span>
                        <p className="text-gray-600">{formData.numeroAprendices}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Información de Proceso */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Proceso de Revisión</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Su solicitud será enviada al coordinador de su centro para revisión inicial</p>
                  <p>• El coordinador evaluará la pertinencia y viabilidad del programa solicitado</p>
                  <p>• Una vez aprobada por el coordinador, será enviada al administrador para aprobación final</p>
                  <p>• Recibirá notificaciones por correo electrónico sobre el estado de su solicitud</p>
                  <p>• El tiempo estimado de respuesta es de 5-10 días hábiles</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                  ← Anterior
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                className="flex items-center space-x-2"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                <span>Guardar Borrador</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!validateCurrentStep()}
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit(false)}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                  disabled={!validateCurrentStep() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Enviar Solicitud</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
