"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, Send, FileText, Plus, X, Download, FileSpreadsheet } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"

interface FormData {
  // Información del Instructor
  instructorNombre: string
  instructorCedula: string
  instructorEmail: string
  instructorTelefono: string
  instructorCentro: string
  instructorEspecialidad: string

  // Información del Curso
  nombreCurso: string
  numeroFicha: string
  tipoFormacion: string
  modalidad: string
  duracionHoras: string
  fechaInicio: Date | undefined
  fechaFin: Date | undefined
  numeroAprendices: string

  // Justificación y Competencias
  justificacion: string
  objetivos: string[]
  competencias: string[]
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

export function SolicitudForm() {
  const [formData, setFormData] = useState<FormData>({
    instructorNombre: "",
    instructorCedula: "",
    instructorEmail: "",
    instructorTelefono: "",
    instructorCentro: "Centro de Gestión Agroempresarial",
    instructorEspecialidad: "",
    nombreCurso: "",
    numeroFicha: "",
    tipoFormacion: "",
    modalidad: "",
    duracionHoras: "",
    fechaInicio: undefined,
    fechaFin: undefined,
    numeroAprendices: "",
    justificacion: "",
    objetivos: [""],
    competencias: [""],
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
  const totalSteps = 5

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: "objetivos" | "competencias") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const updateArrayItem = (field: "objetivos" | "competencias", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeArrayItem = (field: "objetivos" | "competencias", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.instructorNombre && formData.instructorCedula && formData.instructorEmail
      case 2:
        return formData.nombreCurso && formData.numeroFicha && formData.tipoFormacion && formData.modalidad
      case 3:
        return formData.justificacion && formData.objetivos.some((obj) => obj.trim())
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
    try {
      // Simular envío al servidor
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const solicitudData = {
        ...formData,
        id: `SOL-${Date.now()}`,
        fechaSolicitud: new Date().toISOString(),
        estado: isDraft ? "borrador" : "pendiente",
        version: "1.0",
      }

      // Guardar en localStorage para simular persistencia
      const solicitudes = JSON.parse(localStorage.getItem("sena_solicitudes") || "[]")
      solicitudes.push(solicitudData)
      localStorage.setItem("sena_solicitudes", JSON.stringify(solicitudes))

      setSubmitStatus("success")

      if (!isDraft) {
        // Redirigir a la lista de solicitudes después de 2 segundos
        setTimeout(() => {
          window.location.href = "/mis-solicitudes"
        }, 2000)
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExportPDF = () => {
    console.log("Generando PDF de la solicitud...")
    // Aquí iría la lógica para generar PDF
  }

  const handleExportExcel = () => {
    console.log("Generando Excel de la solicitud...")
    // Aquí iría la lógica para generar Excel
  }

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100
  }

  const steps = [
    { number: 1, title: "Información Personal", description: "Datos del instructor solicitante" },
    { number: 2, title: "Detalles del Programa", description: "Información del curso y ficha" },
    { number: 3, title: "Justificación Académica", description: "Objetivos y competencias" },
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
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Descargar Excel
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
            <Progress value={getStepProgress()} className="h-2" />
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
          {/* Step 1: Información Personal */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                  <Input
                    value={formData.instructorNombre}
                    onChange={(e) => handleInputChange("instructorNombre", e.target.value)}
                    placeholder="Nombre completo del instructor"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cédula de Ciudadanía *</label>
                  <Input
                    value={formData.instructorCedula}
                    onChange={(e) => handleInputChange("instructorCedula", e.target.value)}
                    placeholder="Número de cédula"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico Institucional *
                  </label>
                  <Input
                    type="email"
                    value={formData.instructorEmail}
                    onChange={(e) => handleInputChange("instructorEmail", e.target.value)}
                    placeholder="correo@sena.edu.co"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto</label>
                  <Input
                    value={formData.instructorTelefono}
                    onChange={(e) => handleInputChange("instructorTelefono", e.target.value)}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Centro de Formación</label>
                  <Input
                    value={formData.instructorCentro}
                    onChange={(e) => handleInputChange("instructorCentro", e.target.value)}
                    placeholder="Centro de Gestión Agroempresarial"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad/Área</label>
                  <Select
                    value={formData.instructorEspecialidad}
                    onValueChange={(value) => handleInputChange("instructorEspecialidad", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agropecuaria">Producción Agropecuaria</SelectItem>
                      <SelectItem value="agroindustrial">Procesamiento Agroindustrial</SelectItem>
                      <SelectItem value="gestion">Gestión Empresarial</SelectItem>
                      <SelectItem value="ambiental">Gestión Ambiental</SelectItem>
                      <SelectItem value="tecnologia">Tecnologías de la Información</SelectItem>
                      <SelectItem value="otra">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Detalles del Programa */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Programa de Formación *
                  </label>
                  <Input
                    value={formData.nombreCurso}
                    onChange={(e) => handleInputChange("nombreCurso", e.target.value)}
                    placeholder="Ej: Excel Avanzado para Análisis de Datos"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Ficha *</label>
                  <Input
                    value={formData.numeroFicha}
                    onChange={(e) => handleInputChange("numeroFicha", e.target.value)}
                    placeholder="Ej: 2024001"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Formación *</label>
                  <Select
                    value={formData.tipoFormacion}
                    onValueChange={(value) => handleInputChange("tipoFormacion", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complementaria">Formación Complementaria</SelectItem>
                      <SelectItem value="transversal">Transversal</SelectItem>
                      <SelectItem value="especifica">Específica</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad *</label>
                  <Select value={formData.modalidad} onValueChange={(value) => handleInputChange("modalidad", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="mixta">Mixta (Blended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duración (Horas) *</label>
                  <Input
                    type="number"
                    value={formData.duracionHoras}
                    onChange={(e) => handleInputChange("duracionHoras", e.target.value)}
                    placeholder="40"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Aprendices</label>
                  <Input
                    type="number"
                    value={formData.numeroAprendices}
                    onChange={(e) => handleInputChange("numeroAprendices", e.target.value)}
                    placeholder="25"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Justificación Académica */}
          {currentStep === 3 && (
            <div className="space-y-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos de Aprendizaje *</label>
                <div className="space-y-3">
                  {formData.objetivos.map((objetivo, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={objetivo}
                        onChange={(e) => updateArrayItem("objetivos", index, e.target.value)}
                        placeholder={`Objetivo específico ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.objetivos.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("objetivos", index)}
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
                    onClick={() => addArrayItem("objetivos")}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar Objetivo</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competencias a Desarrollar *</label>
                <div className="space-y-3">
                  {formData.competencias.map((competencia, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={competencia}
                        onChange={(e) => updateArrayItem("competencias", index, e.target.value)}
                        placeholder={`Competencia específica ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.competencias.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("competencias", index)}
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
                    onClick={() => addArrayItem("competencias")}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar Competencia</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultados de Aprendizaje Esperados
                </label>
                <Textarea
                  value={formData.resultadosEsperados}
                  onChange={(e) => handleInputChange("resultadosEsperados", e.target.value)}
                  placeholder="Describa los resultados específicos que espera alcanzar con los aprendices al finalizar esta formación complementaria..."
                  rows={3}
                />
              </div>
            </div>
          )}

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
              <div className="p-6 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Resumen de la Solicitud
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Instructor:</span>
                      <p className="text-gray-600">{formData.instructorNombre || "No especificado"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Programa:</span>
                      <p className="text-gray-600">{formData.nombreCurso || "No especificado"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Ficha:</span>
                      <p className="text-gray-600">{formData.numeroFicha || "No especificado"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Duración:</span>
                      <p className="text-gray-600">
                        {formData.duracionHoras ? `${formData.duracionHoras} horas` : "No especificado"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Modalidad:</span>
                      <p className="text-gray-600">{formData.modalidad || "No especificado"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tipo:</span>
                      <p className="text-gray-600">{formData.tipoFormacion || "No especificado"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de Proceso */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">📋 Proceso de Revisión</h4>
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
