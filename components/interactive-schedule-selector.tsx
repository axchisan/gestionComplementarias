"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Plus, X, Clock, Calculator, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react"

interface HorarioDetallado {
  id: string
  diaSemana: string
  fecha: Date | undefined
  horaInicio: string
  horaFin: string
  esFlexible: boolean
  observaciones: string
}

interface ScheduleStats {
  totalHorasSemanales: number
  totalHorasPrograma: number
  horasRestantes: number
  semanasEstimadas: number
  fechaFinEstimada: Date | undefined
  porcentajeCompletado: number
}

interface InteractiveScheduleSelectorProps {
  horarios: HorarioDetallado[]
  duracionPrograma: number
  fechaInicio: Date | undefined
  fechaFin: Date | undefined
  onHorariosChange: (horarios: HorarioDetallado[]) => void
  onFechaFinChange: (fecha: Date | undefined) => void
}

const DIAS_SEMANA = [
  { value: "LUNES", label: "Lunes", short: "L" },
  { value: "MARTES", label: "Martes", short: "M" },
  { value: "MIERCOLES", label: "Miércoles", short: "X" },
  { value: "JUEVES", label: "Jueves", short: "J" },
  { value: "VIERNES", label: "Viernes", short: "V" },
  { value: "SABADO", label: "Sábado", short: "S" },
  { value: "DOMINGO", label: "Domingo", short: "D" },
]

const HORAS_DISPONIBLES = Array.from({ length: 15 }, (_, i) => {
  const hora = i + 6 // Desde las 6:00 hasta las 20:00
  return `${hora.toString().padStart(2, "0")}:00`
})

const PLANTILLAS_HORARIO = [
  {
    nombre: "Mañana Completa",
    descripcion: "Lunes a Viernes 8:00 - 12:00",
    horarios: [
      { diaSemana: "LUNES", horaInicio: "08:00", horaFin: "12:00" },
      { diaSemana: "MARTES", horaInicio: "08:00", horaFin: "12:00" },
      { diaSemana: "MIERCOLES", horaInicio: "08:00", horaFin: "12:00" },
      { diaSemana: "JUEVES", horaInicio: "08:00", horaFin: "12:00" },
      { diaSemana: "VIERNES", horaInicio: "08:00", horaFin: "12:00" },
    ],
  },
  {
    nombre: "Tarde Completa",
    descripcion: "Lunes a Viernes 14:00 - 18:00",
    horarios: [
      { diaSemana: "LUNES", horaInicio: "14:00", horaFin: "18:00" },
      { diaSemana: "MARTES", horaInicio: "14:00", horaFin: "18:00" },
      { diaSemana: "MIERCOLES", horaInicio: "14:00", horaFin: "18:00" },
      { diaSemana: "JUEVES", horaInicio: "14:00", horaFin: "18:00" },
      { diaSemana: "VIERNES", horaInicio: "14:00", horaFin: "18:00" },
    ],
  },
  {
    nombre: "Intensivo Fin de Semana",
    descripción: "Sábados y Domingos 8:00 - 16:00",
    horarios: [
      { diaSemana: "SABADO", horaInicio: "08:00", horaFin: "16:00" },
      { diaSemana: "DOMINGO", horaInicio: "08:00", horaFin: "16:00" },
    ],
  },
  {
    nombre: "Nocturno",
    descripcion: "Lunes, Miércoles, Viernes 18:00 - 22:00",
    horarios: [
      { diaSemana: "LUNES", horaInicio: "18:00", horaFin: "22:00" },
      { diaSemana: "MIERCOLES", horaInicio: "18:00", horaFin: "22:00" },
      { diaSemana: "VIERNES", horaInicio: "18:00", horaFin: "22:00" },
    ],
  },
]

export function InteractiveScheduleSelector({
  horarios,
  duracionPrograma,
  fechaInicio,
  fechaFin,
  onHorariosChange,
  onFechaFinChange,
}: InteractiveScheduleSelectorProps) {
  const [stats, setStats] = useState<ScheduleStats>({
    totalHorasSemanales: 0,
    totalHorasPrograma: 0,
    horasRestantes: 0,
    semanasEstimadas: 0,
    fechaFinEstimada: undefined,
    porcentajeCompletado: 0,
  })

  const [showCalculator, setShowCalculator] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  // Calcular estadísticas automáticamente
  useEffect(() => {
    calculateStats()
  }, [horarios, duracionPrograma, fechaInicio])

  const calculateStats = () => {
    const totalHorasSemanales = horarios.reduce((total, horario) => {
      if (horario.horaInicio && horario.horaFin) {
        const inicio = Number.parseInt(horario.horaInicio.split(":")[0])
        const fin = Number.parseInt(horario.horaFin.split(":")[0])
        return total + (fin - inicio)
      }
      return total
    }, 0)

    const horasRestantes = Math.max(0, duracionPrograma - totalHorasSemanales)
    const semanasEstimadas = totalHorasSemanales > 0 ? Math.ceil(duracionPrograma / totalHorasSemanales) : 0
    const porcentajeCompletado = duracionPrograma > 0 ? (totalHorasSemanales / duracionPrograma) * 100 : 0

    let fechaFinEstimada: Date | undefined
    if (fechaInicio && totalHorasSemanales > 0) {
      const diasNecesarios = semanasEstimadas * 7
      fechaFinEstimada = addDays(fechaInicio, diasNecesarios)
    }

    setStats({
      totalHorasSemanales,
      totalHorasPrograma: duracionPrograma,
      horasRestantes,
      semanasEstimadas,
      fechaFinEstimada,
      porcentajeCompletado: Math.min(100, porcentajeCompletado),
    })

    // Actualizar fecha fin automáticamente
    if (fechaFinEstimada && onFechaFinChange) {
      onFechaFinChange(fechaFinEstimada)
    }
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addHorario = () => {
    const newHorario: HorarioDetallado = {
      id: generateId(),
      diaSemana: "LUNES",
      fecha: fechaInicio,
      horaInicio: "08:00",
      horaFin: "12:00",
      esFlexible: true,
      observaciones: "",
    }
    onHorariosChange([...horarios, newHorario])
  }

  const updateHorario = (id: string, field: keyof HorarioDetallado, value: any) => {
    const updatedHorarios = horarios.map((horario) => (horario.id === id ? { ...horario, [field]: value } : horario))
    onHorariosChange(updatedHorarios)
  }

  const removeHorario = (id: string) => {
    const updatedHorarios = horarios.filter((horario) => horario.id !== id)
    onHorariosChange(updatedHorarios)
  }

  const applyTemplate = (templateName: string) => {
    const template = PLANTILLAS_HORARIO.find((t) => t.nombre === templateName)
    if (!template || !fechaInicio) return

    const newHorarios: HorarioDetallado[] = template.horarios.map((horario, index) => ({
      id: generateId(),
      diaSemana: horario.diaSemana,
      fecha: addDays(fechaInicio, index % 7), // Distribuir en la primera semana
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      esFlexible: true,
      observaciones: `Generado desde plantilla: ${templateName}`,
    }))

    onHorariosChange(newHorarios)
    setSelectedTemplate("")
  }

  const generateOptimalSchedule = () => {
    if (!fechaInicio || duracionPrograma <= 0) return

    // Calcular horario óptimo basado en duración del programa
    const horasPorDia = 4 // Default 4 horas por día
    const diasNecesarios = Math.ceil(duracionPrograma / horasPorDia)

    const newHorarios: HorarioDetallado[] = []
    let currentDate = fechaInicio
    let horasAsignadas = 0

    for (let i = 0; i < diasNecesarios && horasAsignadas < duracionPrograma; i++) {
      // Saltar fines de semana por defecto
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate = addDays(currentDate, 1)
      }

      const horasRestantesHoy = Math.min(horasPorDia, duracionPrograma - horasAsignadas)
      const horaFin = `${8 + horasRestantesHoy}:00`.padStart(5, "0")

      newHorarios.push({
        id: generateId(),
        diaSemana: DIAS_SEMANA[currentDate.getDay() - 1]?.value || "LUNES",
        fecha: new Date(currentDate),
        horaInicio: "08:00",
        horaFin: horaFin,
        esFlexible: true,
        observaciones: "Generado automáticamente",
      })

      horasAsignadas += horasRestantesHoy
      currentDate = addDays(currentDate, 1)
    }

    onHorariosChange(newHorarios)
  }

  const getStatusColor = () => {
    if (stats.porcentajeCompletado >= 100) return "text-green-600"
    if (stats.porcentajeCompletado >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = () => {
    if (stats.porcentajeCompletado >= 100) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (stats.porcentajeCompletado >= 80) return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    return <AlertTriangle className="h-5 w-5 text-red-600" />
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas y Calculadora */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span>Calculadora de Horarios</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowCalculator(!showCalculator)}>
              {showCalculator ? "Ocultar" : "Mostrar"} Calculadora
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{stats.totalHorasSemanales}h</div>
              <div className="text-sm text-blue-700">Horas Semanales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{stats.horasRestantes}h</div>
              <div className="text-sm text-blue-700">Horas Restantes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{stats.semanasEstimadas}</div>
              <div className="text-sm text-blue-700">Semanas Estimadas</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>{Math.round(stats.porcentajeCompletado)}%</div>
              <div className="text-sm text-blue-700">Completado</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            {getStatusIcon()}
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stats.porcentajeCompletado >= 100
                      ? "bg-green-600"
                      : stats.porcentajeCompletado >= 80
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }`}
                  style={{ width: `${Math.min(100, stats.porcentajeCompletado)}%` }}
                />
              </div>
            </div>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {stats.totalHorasSemanales} / {duracionPrograma} horas
            </span>
          </div>

          {stats.fechaFinEstimada && (
            <div className="text-sm text-blue-700">
              <strong>Fecha estimada de finalización:</strong> {format(stats.fechaFinEstimada, "PPP", { locale: es })}
            </div>
          )}

          {showCalculator && (
            <div className="mt-4 p-4 bg-white rounded-lg border space-y-4">
              <h4 className="font-medium text-gray-900">Herramientas de Planificación</h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Plantillas de Horario</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar plantilla" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLANTILLAS_HORARIO.map((template) => (
                        <SelectItem key={template.nombre} value={template.nombre}>
                          {template.nombre} - {template.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplate && (
                    <Button onClick={() => applyTemplate(selectedTemplate)} size="sm" className="mt-2 w-full">
                      Aplicar Plantilla
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Generación Automática</Label>
                  <Button
                    onClick={generateOptimalSchedule}
                    variant="outline"
                    className="w-full mt-2 bg-transparent"
                    disabled={!fechaInicio || duracionPrograma <= 0}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Generar Horario Óptimo
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Genera automáticamente un horario basado en la duración del programa
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas y Recomendaciones */}
      {stats.porcentajeCompletado < 100 && stats.horasRestantes > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Horas Insuficientes</h4>
                <p className="text-sm text-yellow-800">
                  Necesita agregar {stats.horasRestantes} horas más para completar el programa de {duracionPrograma}{" "}
                  horas. Considere agregar más días o extender las horas diarias.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.porcentajeCompletado > 100 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Horas Excedentes</h4>
                <p className="text-sm text-blue-800">
                  Ha programado {stats.totalHorasSemanales - duracionPrograma} horas adicionales. Esto puede ser útil
                  para actividades de refuerzo o evaluación.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selector de Horarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Horarios Detallados</span>
            </div>
            <Button onClick={addHorario} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Horario
            </Button>
          </CardTitle>
          <CardDescription>
            Configure los horarios específicos con fechas exactas. El sistema calculará automáticamente las horas
            totales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {horarios.map((horario) => (
              <Card key={horario.id} className="p-4 bg-gray-50">
                <div className="grid grid-cols-6 gap-4 items-end mb-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1">Día de la Semana</Label>
                    <Select
                      value={horario.diaSemana}
                      onValueChange={(value) => updateHorario(horario.id, "diaSemana", value)}
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
                    <Label className="text-sm font-medium text-gray-700 mb-1">Fecha Específica</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {horario.fecha ? format(horario.fecha, "dd/MM", { locale: es }) : "Fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={horario.fecha}
                          onSelect={(date) => updateHorario(horario.id, "fecha", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1">Hora Inicio</Label>
                    <Select
                      value={horario.horaInicio}
                      onValueChange={(value) => updateHorario(horario.id, "horaInicio", value)}
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
                    <Label className="text-sm font-medium text-gray-700 mb-1">Hora Fin</Label>
                    <Select
                      value={horario.horaFin}
                      onValueChange={(value) => updateHorario(horario.id, "horaFin", value)}
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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`flexible-${horario.id}`}
                      checked={horario.esFlexible}
                      onChange={(checked) => updateHorario(horario.id, "esFlexible", checked)}
                    />
                    <Label htmlFor={`flexible-${horario.id}`} className="text-sm">
                      Flexible
                    </Label>
                  </div>

                  <div>
                    <Button
                      onClick={() => removeHorario(horario.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`observaciones-${horario.id}`} className="text-sm">
                      Observaciones
                    </Label>
                    <Textarea
                      id={`observaciones-${horario.id}`}
                      value={horario.observaciones}
                      onChange={(e) => updateHorario(horario.id, "observaciones", e.target.value)}
                      placeholder="Notas sobre este horario..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center">
                    {horario.fecha && horario.horaInicio && horario.horaFin && (
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{format(horario.fecha, "EEEE, dd 'de' MMMM", { locale: es })}</div>
                        <div>
                          {horario.horaInicio} - {horario.horaFin}(
                          {Number.parseInt(horario.horaFin.split(":")[0]) -
                            Number.parseInt(horario.horaInicio.split(":")[0])}{" "}
                          horas)
                        </div>
                        {horario.esFlexible && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Horario Flexible
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {horarios.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay horarios configurados</h3>
                <p className="text-gray-600 mb-4">
                  Agregue horarios para comenzar a planificar su programa de formación
                </p>
                <Button onClick={addHorario} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Horario
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
