"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Clock,
  User,
  BookOpen,
  Award,
  Target,
  Lightbulb,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { InteractiveScheduleSelector } from "@/components/interactive-schedule-selector"

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
  _count?: {
    solicitudes: number
  }
}

interface HorarioDetallado {
  id: string
  diaSemana: string
  fecha: Date | undefined
  horaInicio: string
  horaFin: string
  esFlexible: boolean
  observaciones: string
}

interface FormData {
  // Información General y Encabezado
  fechaCaracterizacion: Date | undefined;
  responsableNombre: string;
  responsableCedula: string;
  responsableEmail: string;

  // Datos del Programa
  programaId: string;
  programaSeleccionado: Programa | null;
  codigoPrograma: string;
  versionPrograma: string;
  duracionMaxima: number;
  cupoMaximo: number;
  numeroAprendicesInscribir: number;
  modalidad: string;

  // Datos de la Empresa y/o Población Objeto
  municipio: string;
  departamento: string;
  nombreEmpresa: string;
  nitEmpresa: string;
  codigoEmpresa: string;
  representanteLegal: string;
  fechaCreacionEmpresa: Date | undefined;
  direccionEmpresa: string;
  telefonosEmpresa: string;

  // Ambiente de Formación
  lugarFormacion: string;
  tipoAmbiente: string;

  // Caracterización de Programas Especiales
  programaEmprendimiento: boolean;
  programaBilinguismo: boolean;
  atencionInstituciones: boolean;
  posconflicto: boolean;
  senaEmprendeRural: boolean;
  formacionEspecialMypimes: boolean;
  senaEmprendeRuralPosconflicto: boolean;
  tecnoacademiaSennova: boolean;
  campesenaConvenio8842: boolean;
  fullPopularConvenio8882: boolean;
  icbfInstituto: boolean;
  policiaNacional: boolean;
  otroEspecificar: string;

  // Diagrama de Programación
  inicioInscripcion: Date | undefined;
  finalizacionInscripcion: Date | undefined;
  fechaInicioCurso: Date | undefined;
  fechaFinalizacionCurso: Date | undefined;

  // Horarios Detallados
  horarios: HorarioDetallado[];

  // Justificación
  justificacion: string;
  objetivosPersonalizados: string[];
  resultadosEsperados: string;
  observaciones: string;

  // Validaciones
  cumpleRequisitos: boolean;
  autorizaUsoInfo: boolean;
  confirmaVeracidad: boolean;
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

const HORAS_DISPONIBLES = Array.from({ length: 15 }, (_, i) => {
  const hora = i + 6 // Desde las 6:00 hasta las 20:00
  return `${hora.toString().padStart(2, "0")}:00`
})

const MODALIDADES = [
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "VIRTUAL", label: "Virtual" },
  { value: "DESESCOLARIZADA", label: "Desescolarizada" },
  { value: "COMBINADA", label: "Combinada" },
]

const TIPOS_AMBIENTE = [
  { value: "AULA", label: "Aula" },
  { value: "AULA_MOVIL", label: "Aula Móvil" },
  { value: "LABORATORIO", label: "Laboratorio" },
  { value: "TALLER", label: "Taller" },
  { value: "CAMPO", label: "Campo" },
  { value: "EMPRESA", label: "Empresa" },
]

export function SolicitudForm() {
  const { user, token } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [programas, setProgramas] = useState<Programa[]>([])
  const [searchPrograma, setSearchPrograma] = useState("")
  const [loadingProgramas, setLoadingProgramas] = useState(false)
  const [initialProgramasLoaded, setInitialProgramasLoaded] = useState(false)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const [formData, setFormData] = useState<FormData>({
  fechaCaracterizacion: new Date(), // Set default to current date
  responsableNombre: "",
  responsableCedula: "",
  responsableEmail: "",

  programaId: "",
  programaSeleccionado: null,
  codigoPrograma: "",
  versionPrograma: "1",
  duracionMaxima: 0,
  cupoMaximo: 0,
  numeroAprendicesInscribir: 0,
  modalidad: "PRESENCIAL",

  municipio: "",
  departamento: "",
  nombreEmpresa: "",
  nitEmpresa: "",
  codigoEmpresa: "",
  representanteLegal: "",
  fechaCreacionEmpresa: undefined,
  direccionEmpresa: "",
  telefonosEmpresa: "",

  lugarFormacion: "",
  tipoAmbiente: "AULA",

  programaEmprendimiento: false,
  programaBilinguismo: false,
  atencionInstituciones: false,
  posconflicto: false,
  senaEmprendeRural: false,
  formacionEspecialMypimes: false,
  senaEmprendeRuralPosconflicto: false,
  tecnoacademiaSennova: false,
  campesenaConvenio8842: false,
  fullPopularConvenio8882: false,
  icbfInstituto: false,
  policiaNacional: false,
  otroEspecificar: "",

  inicioInscripcion: undefined,
  finalizacionInscripcion: undefined,
  fechaInicioCurso: undefined,
  fechaFinalizacionCurso: undefined,

  horarios: [],

  justificacion: "",
  objetivosPersonalizados: [""],
  resultadosEsperados: "",  // Fixed: Use "" instead of string
  observaciones: "",

  cumpleRequisitos: false,   // Fixed: Use false instead of boolean
  autorizaUsoInfo: false,   // Fixed: Use false instead of boolean
  confirmaVeracidad: false, // Fixed: Use false instead of boolean
});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        responsableNombre: user.name || "",
        responsableCedula: user.cedula || "",
        responsableEmail: user.email || "",
      }))
    }
  }, [user])

  useEffect(() => {
    if (user && token && !initialProgramasLoaded) {
      loadProgramas()
      setInitialProgramasLoaded(true)
    }
  }, [user, token, initialProgramasLoaded])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const loadProgramas = async () => {
    if (!token) return

    setLoadingProgramas(true)
    try {
      const searchParam = searchPrograma ? `&search=${encodeURIComponent(searchPrograma)}` : ""
      const response = await fetch(`/api/programas?limit=50${searchParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProgramas(data.programas || [])
      }
    } catch (error) {
      console.error("Error cargando programas:", error)
    } finally {
      setLoadingProgramas(false)
    }
  }

  useEffect(() => {
    if (initialProgramasLoaded) {
      const timeoutId = setTimeout(() => {
        loadProgramas()
      }, 300) // 300ms debounce

      return () => clearTimeout(timeoutId)
    }
  }, [searchPrograma, initialProgramasLoaded])

  const handleProgramaSelect = async (programaId: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/programas/${programaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const programa = data.programa

        setFormData((prev) => ({
          ...prev,
          programaId,
          programaSeleccionado: programa,
          codigoPrograma: programa.codigo,
          duracionMaxima: programa.duracionHoras,
          cupoMaximo: programa.cupoAprendices,
          numeroAprendicesInscribir: Math.min(32, programa.cupoAprendices), // Default from Excel
          modalidad: programa.modalidad,
        }))
      }
    } catch (error) {
      console.error("Error cargando programa:", error)
    }
  }

  const addHorario = () => {
    const newHorario: HorarioDetallado = {
      id: generateId(),
      diaSemana: "LUNES",
      fecha: undefined,
      horaInicio: "08:00",
      horaFin: "12:00",
      esFlexible: true,
      observaciones: "",
    }
    setFormData((prev) => ({
      ...prev,
      horarios: [...prev.horarios, newHorario],
    }))
  }

  const updateHorario = (index: number, field: keyof HorarioDetallado, value: any) => {
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
      if (horario.horaInicio && horario.horaFin) {
        const inicio = Number.parseInt(horario.horaInicio.split(":")[0])
        const fin = Number.parseInt(horario.horaFin.split(":")[0])
        return total + (fin - inicio)
      }
      return total
    }, 0)
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.programaSeleccionado !== null &&
          formData.responsableNombre &&
          formData.responsableCedula &&
          formData.responsableEmail
        ) // Add validation for instructor data
      case 2:
        return (
          formData.municipio &&
          formData.departamento &&
          formData.nombreEmpresa &&
          formData.representanteLegal &&
          formData.direccionEmpresa &&
          formData.lugarFormacion
        )
      case 3:
        return (
          formData.inicioInscripcion &&
          formData.finalizacionInscripcion &&
          formData.fechaInicioCurso &&
          formData.fechaFinalizacionCurso &&
          formData.horarios.length > 0
        )
      case 4:
        return formData.programaSeleccionado !== null && formData.programaSeleccionado.objetivos.length > 0
      case 5:
        return formData.cumpleRequisitos && formData.autorizaUsoInfo && formData.confirmaVeracidad
      default:
        return true
    }
  }

  const handleSubmit = async (isDraft = false) => {
    if (!token || !user) return

    setSubmitStatus("loading")
    setSubmitError(null)

    try {
      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          isDraft,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
      } else {
        const errorData = await response.json()
        setSubmitError(errorData.error || "Error al enviar la solicitud")
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitError("Error de conexión. Intente nuevamente.")
      setSubmitStatus("error")
    }
  }

  const steps = [
    { number: 1, title: "Selección de Programa", description: "Programa de formación complementaria" },
    { number: 2, title: "Datos de Empresa y Ubicación", description: "Información de la entidad y lugar" },
    { number: 3, title: "Programación y Horarios", description: "Fechas, inscripciones y horarios" },
    { number: 4, title: "Justificación Académica", description: "Objetivos y justificación" },
    { number: 5, title: "Validación y Envío", description: "Confirmaciones finales" },
  ]

  const updateArrayItem = (arrayName: keyof FormData, index: number, value: any) => {
    setFormData((prev) => {
      const array = [...(prev[arrayName] as any[])]
      array[index] = value
      return { ...prev, [arrayName]: array }
    })
  }

  const removeArrayItem = (arrayName: keyof FormData, index: number) => {
    setFormData((prev) => {
      const array = [...(prev[arrayName] as any[])]
      array.splice(index, 1)
      return { ...prev, [arrayName]: array }
    })
  }

  const addArrayItem = (arrayName: keyof FormData) => {
    setFormData((prev) => {
      const array = [...(prev[arrayName] as any[])]
      array.push("")
      return { ...prev, [arrayName]: array }
    })
  }

  const handleHorariosChange = (newHorarios: HorarioDetallado[]) => {
    setFormData((prev) => ({ ...prev, horarios: newHorarios }))
  }

  const handleFechaFinChange = (fecha: Date | undefined) => {
    setFormData((prev) => ({ ...prev, fechaFinalizacionCurso: fecha }))
  }

  if (submitStatus === "success") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Solicitud Enviada Exitosamente</h2>
          <p className="text-gray-600 mb-6">
            Su solicitud de formación complementaria ha sido enviada y está siendo procesada. Recibirá una notificación
            por correo electrónico cuando sea revisada.
          </p>
          <div className="space-y-3">
            <Button onClick={() => (window.location.href = "/mis-solicitudes")} className="w-full">
              Ver Mis Solicitudes
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
              Crear Nueva Solicitud
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <img src="/sena-logo.png" alt="SENA" className="h-16 w-16" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FICHA CARACTERIZACIÓN</h1>
            <p className="text-sm text-gray-600">SERVICIO NACIONAL DE APRENDIZAJE</p>
            <p className="text-sm text-gray-600">CENTRO DE GESTIÓN AGROEMPRESARIAL DEL ORIENTE</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">Documento de Apoyo: CGAO N°14 V2 | Código: F11-3030-003/03-06</div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {step.number}
            </div>
            <div className="ml-3 hidden md:block">
              <p className={`text-sm font-medium ${currentStep >= step.number ? "text-green-600" : "text-gray-400"}`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? "bg-green-600" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>

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
              {/* Información General */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Información General</CardTitle>
                  <CardDescription>
                    Los datos del instructor se cargan automáticamente y no son modificables
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fechaCaracterizacion">Fecha de Caracterización *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.fechaCaracterizacion
                              ? format(formData.fechaCaracterizacion, "PPP", { locale: es })
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.fechaCaracterizacion}
                            onSelect={(date) => handleInputChange("fechaCaracterizacion", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="responsableNombre">Responsable de la Caracterización *</Label>
                      <Input
                        id="responsableNombre"
                        value={formData.responsableNombre}
                        onChange={(e) => handleInputChange("responsableNombre", e.target.value)}
                        disabled={!!user?.name} // Disable if user data is loaded
                        className={user?.name ? "bg-gray-100" : ""}
                        required
                      />
                      {user?.name && (
                        <p className="text-xs text-gray-500 mt-1">Cargado automáticamente desde su perfil</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="responsableCedula">C.C. *</Label>
                      <Input
                        id="responsableCedula"
                        value={formData.responsableCedula}
                        onChange={(e) => handleInputChange("responsableCedula", e.target.value)}
                        disabled={!!user?.cedula} // Disable if user data is loaded
                        className={user?.cedula ? "bg-gray-100" : ""}
                        required
                      />
                      {user?.cedula && (
                        <p className="text-xs text-gray-500 mt-1">Cargado automáticamente desde su perfil</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="responsableEmail">Correo Electrónico *</Label>
                      <Input
                        id="responsableEmail"
                        type="email"
                        value={formData.responsableEmail}
                        onChange={(e) => handleInputChange("responsableEmail", e.target.value)}
                        disabled={!!user?.email} // Disable if user data is loaded
                        className={user?.email ? "bg-gray-100" : ""}
                        required
                      />
                      {user?.email && (
                        <p className="text-xs text-gray-500 mt-1">Cargado automáticamente desde su perfil</p>
                      )}
                    </div>
                  </div>

                  {user?.centro && (
                    <div>
                      <Label>Centro de Formación</Label>
                      <div className="p-3 bg-gray-100 rounded-md">
                        <p className="font-medium text-gray-900">{user.centro.nombre}</p>
                        {user.especialidad && (
                          <p className="text-sm text-gray-600">Especialidad: {user.especialidad}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tipo de Programa */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tipo de Programa</CardTitle>
                  <CardDescription>
                    Seleccione el tipo de formación. Para este sistema, solo está habilitada la formación
                    complementaria.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="titulada" disabled />
                      <Label htmlFor="titulada" className="text-gray-500">
                        Titulada Regular
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="articulacion" disabled />
                      <Label htmlFor="articulacion" className="text-gray-500">
                        Articulación
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="complementaria" checked disabled />
                      <Label htmlFor="complementaria" className="font-medium text-green-700">
                        Complementaria ✓
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ser" disabled />
                      <Label htmlFor="ser" className="text-gray-500">
                        SER
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Búsqueda de Programa */}
              <div>
                <Label className="text-base font-medium">Programas de Formación Complementaria Disponibles</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Seleccione el programa de formación complementaria que desea solicitar. Use el buscador para filtrar
                  por nombre o código.
                </p>
                <div className="flex space-x-2 mb-4">
                  <Input
                    value={searchPrograma}
                    onChange={(e) => setSearchPrograma(e.target.value)}
                    placeholder="Filtrar programas por nombre o código..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      setSearchPrograma("")
                      loadProgramas()
                    }}
                    variant="outline"
                    disabled={loadingProgramas}
                  >
                    {searchPrograma ? "Limpiar" : "Actualizar"}
                  </Button>
                </div>

                {loadingProgramas && (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Cargando programas disponibles...</p>
                  </div>
                )}

                {!loadingProgramas && programas.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {searchPrograma
                        ? `Se encontraron ${programas.length} programas que coinciden con "${searchPrograma}"`
                        : `${programas.length} programas de formación complementaria disponibles para su centro`}
                    </p>
                  </div>
                )}

                {!loadingProgramas && programas.length === 0 && !searchPrograma && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay programas disponibles</h3>
                    <p className="text-gray-600 mb-4">
                      No se encontraron programas de formación complementaria para su centro.
                    </p>
                    <Button onClick={loadProgramas} variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Recargar Programas
                    </Button>
                  </div>
                )}

                {!loadingProgramas && programas.length === 0 && searchPrograma && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">No se encontraron programas con "{searchPrograma}"</p>
                    <p className="text-sm text-gray-500 mb-4">Intente con otros términos de búsqueda</p>
                    <Button onClick={() => setSearchPrograma("")} variant="outline" size="sm">
                      Ver todos los programas
                    </Button>
                  </div>
                )}

                {!loadingProgramas && programas.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {programas.map((programa) => (
                      <Card
                        key={programa.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          formData.programaId === programa.id
                            ? "border-green-500 bg-green-50 ring-2 ring-green-200 shadow-md"
                            : "hover:border-green-300 hover:bg-green-25 hover:shadow-sm"
                        }`}
                        onClick={() => handleProgramaSelect(programa.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900 text-lg">{programa.nombre}</h4>
                                {formData.programaId === programa.id && (
                                  <Badge className="bg-green-100 text-green-800 ml-2">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Seleccionado
                                  </Badge>
                                )}
                              </div>

                              {programa.descripcion && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{programa.descripcion}</p>
                              )}

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <FileText className="h-3 w-3" />
                                  <span>Código: {programa.codigo}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{programa.duracionHoras}h</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>Cupo: {programa.cupoAprendices}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Badge variant="outline" className="text-xs">
                                    {programa.modalidad}
                                  </Badge>
                                </div>
                              </div>

                              {programa._count?.solicitudes > 0 && (
                                <div className="mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {programa._count.solicitudes} solicitudes previas
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Programa Seleccionado */}
              {formData.programaSeleccionado && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-900 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Programa Seleccionado</span>
                    </CardTitle>
                    <CardDescription>Revise y ajuste los datos del programa según sus necesidades</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre del Programa</Label>
                        <p className="font-medium text-gray-900">{formData.programaSeleccionado.nombre}</p>
                        <p className="text-sm text-gray-600">{formData.programaSeleccionado.descripcion}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="codigoPrograma">Código *</Label>
                          <Input
                            id="codigoPrograma"
                            value={formData.codigoPrograma}
                            onChange={(e) => handleInputChange("codigoPrograma", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="versionPrograma">Versión *</Label>
                          <Input
                            id="versionPrograma"
                            value={formData.versionPrograma}
                            onChange={(e) => handleInputChange("versionPrograma", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="duracionMaxima">Duración Máxima (horas) *</Label>
                        <Input
                          id="duracionMaxima"
                          value={formData.duracionMaxima.toString()}
                          onChange={(e) => handleInputChange("duracionMaxima", Number(e.target.value))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cupoMaximo">Cupo Máximo *</Label>
                        <Input
                          id="cupoMaximo"
                          value={formData.cupoMaximo.toString()}
                          onChange={(e) => handleInputChange("cupoMaximo", Number(e.target.value))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="numeroAprendicesInscribir">Número de Aprendices a Inscribir *</Label>
                        <Input
                          id="numeroAprendicesInscribir"
                          value={formData.numeroAprendicesInscribir.toString()}
                          onChange={(e) => handleInputChange("numeroAprendicesInscribir", Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="modalidad">Modalidad *</Label>
                        <Select
                          id="modalidad"
                          value={formData.modalidad}
                          onValueChange={(value) => handleInputChange("modalidad", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar modalidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {MODALIDADES.map((modalidad) => (
                              <SelectItem key={modalidad.value} value={modalidad.value}>
                                {modalidad.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Datos de Empresa y Ubicación */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Datos de la Empresa y/o Población Objeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="municipio">Municipio *</Label>
                      <Input
                        id="municipio"
                        value={formData.municipio}
                        onChange={(e) => handleInputChange("municipio", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="departamento">Departamento *</Label>
                      <Input
                        id="departamento"
                        value={formData.departamento}
                        onChange={(e) => handleInputChange("departamento", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="nombreEmpresa">Nombre de la Empresa *</Label>
                      <Input
                        id="nombreEmpresa"
                        value={formData.nombreEmpresa}
                        onChange={(e) => handleInputChange("nombreEmpresa", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nitEmpresa">NIT de la Empresa</Label>
                      <Input
                        id="nitEmpresa"
                        value={formData.nitEmpresa}
                        onChange={(e) => handleInputChange("nitEmpresa", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="codigoEmpresa">Código de la Empresa</Label>
                      <Input
                        id="codigoEmpresa"
                        value={formData.codigoEmpresa}
                        onChange={(e) => handleInputChange("codigoEmpresa", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="representanteLegal">Representante Legal *</Label>
                    <Input
                      id="representanteLegal"
                      value={formData.representanteLegal}
                      onChange={(e) => handleInputChange("representanteLegal", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fechaCreacionEmpresa">Fecha de Creación de la Empresa</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.fechaCreacionEmpresa
                              ? format(formData.fechaCreacionEmpresa, "PPP", { locale: es })
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.fechaCreacionEmpresa}
                            onSelect={(date) => handleInputChange("fechaCreacionEmpresa", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="direccionEmpresa">Dirección de la Empresa *</Label>
                      <Input
                        id="direccionEmpresa"
                        value={formData.direccionEmpresa}
                        onChange={(e) => handleInputChange("direccionEmpresa", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefonosEmpresa">Teléfonos de la Empresa</Label>
                      <Input
                        id="telefonosEmpresa"
                        value={formData.telefonosEmpresa}
                        onChange={(e) => handleInputChange("telefonosEmpresa", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Ambiente de Formación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="lugarFormacion">Lugar de Formación *</Label>
                    <Input
                      id="lugarFormacion"
                      value={formData.lugarFormacion}
                      onChange={(e) => handleInputChange("lugarFormacion", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipoAmbiente">Tipo de Ambiente</Label>
                    <Select
                      value={formData.tipoAmbiente}
                      onValueChange={(value) => handleInputChange("tipoAmbiente", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_AMBIENTE.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Programación y Horarios */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Caracterización de Programas Especiales o Convenios</CardTitle>
                  <CardDescription>
                    Seleccione si este programa pertenece a alguna categoría especial o convenio específico
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="programaEmprendimiento"
                          checked={formData.programaEmprendimiento}
                          onCheckedChange={(checked) => handleInputChange("programaEmprendimiento", checked)}
                        />
                        <Label htmlFor="programaEmprendimiento">Programa de Emprendimiento</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="programaBilinguismo"
                          checked={formData.programaBilinguismo}
                          onCheckedChange={(checked) => handleInputChange("programaBilinguismo", checked)}
                        />
                        <Label htmlFor="programaBilinguismo">Programa de Bilingüismo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="atencionInstituciones"
                          checked={formData.atencionInstituciones}
                          onCheckedChange={(checked) => handleInputChange("atencionInstituciones", checked)}
                        />
                        <Label htmlFor="atencionInstituciones">Atención a Instituciones</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="posconflicto"
                          checked={formData.posconflicto}
                          onCheckedChange={(checked) => handleInputChange("posconflicto", checked)}
                        />
                        <Label htmlFor="posconflicto">Posconflicto</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="senaEmprendeRural"
                          checked={formData.senaEmprendeRural}
                          onCheckedChange={(checked) => handleInputChange("senaEmprendeRural", checked)}
                        />
                        <Label htmlFor="senaEmprendeRural">SENA Emprende Rural</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="formacionEspecialMypimes"
                          checked={formData.formacionEspecialMypimes}
                          onCheckedChange={(checked) => handleInputChange("formacionEspecialMypimes", checked)}
                        />
                        <Label htmlFor="formacionEspecialMypimes">Formación Especial MYPIMES - PNA</Label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="senaEmprendeRuralPosconflicto"
                          checked={formData.senaEmprendeRuralPosconflicto}
                          onCheckedChange={(checked) => handleInputChange("senaEmprendeRuralPosconflicto", checked)}
                        />
                        <Label htmlFor="senaEmprendeRuralPosconflicto">SENA Emprende Rural Posconflicto</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tecnoacademiaSennova"
                          checked={formData.tecnoacademiaSennova}
                          onCheckedChange={(checked) => handleInputChange("tecnoacademiaSennova", checked)}
                        />
                        <Label htmlFor="tecnoacademiaSennova">Tecnoacademia - SENNOVA</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="campesenaConvenio8842"
                          checked={formData.campesenaConvenio8842}
                          onCheckedChange={(checked) => handleInputChange("campesenaConvenio8842", checked)}
                        />
                        <Label htmlFor="campesenaConvenio8842">CAMPESENA - Convenio 8842</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fullPopularConvenio8882"
                          checked={formData.fullPopularConvenio8882}
                          onCheckedChange={(checked) => handleInputChange("fullPopularConvenio8882", checked)}
                        />
                        <Label htmlFor="fullPopularConvenio8882">Full Popular - Convenio 8882</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="icbfInstituto"
                          checked={formData.icbfInstituto}
                          onCheckedChange={(checked) => handleInputChange("icbfInstituto", checked)}
                        />
                        <Label htmlFor="icbfInstituto">ICBF (Instituto Colombiano de Bienestar Familiar)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="policiaNacional"
                          checked={formData.policiaNacional}
                          onCheckedChange={(checked) => handleInputChange("policiaNacional", checked)}
                        />
                        <Label htmlFor="policiaNacional">Policía Nacional</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="otroEspecificar">Otro (especifique cuál)</Label>
                    <Input
                      id="otroEspecificar"
                      value={formData.otroEspecificar}
                      onChange={(e) => handleInputChange("otroEspecificar", e.target.value)}
                      placeholder="Especifique otro tipo de programa o convenio"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Diagrama de Programación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inicioInscripcion">Inicio de Inscripción</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.inicioInscripcion
                              ? format(formData.inicioInscripcion, "PPP", { locale: es })
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.inicioInscripcion}
                            onSelect={(date) => handleInputChange("inicioInscripcion", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="finalizacionInscripcion">Finalización de Inscripción</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.finalizacionInscripcion
                              ? format(formData.finalizacionInscripcion, "PPP", { locale: es })
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.finalizacionInscripcion}
                            onSelect={(date) => handleInputChange("finalizacionInscripcion", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fechaInicioCurso">Fecha de Inicio del Curso</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.fechaInicioCurso
                              ? format(formData.fechaInicioCurso, "PPP", { locale: es })
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.fechaInicioCurso}
                            onSelect={(date) => handleInputChange("fechaInicioCurso", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="fechaFinalizacionCurso">Fecha de Finalización del Curso</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.fechaFinalizacionCurso
                              ? format(formData.fechaFinalizacionCurso, "PPP", { locale: es })
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.fechaFinalizacionCurso}
                            onSelect={(date) => handleInputChange("fechaFinalizacionCurso", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <InteractiveScheduleSelector
                horarios={formData.horarios}
                duracionPrograma={formData.duracionMaxima}
                fechaInicio={formData.fechaInicioCurso}
                fechaFin={formData.fechaFinalizacionCurso}
                onHorariosChange={handleHorariosChange}
                onFechaFinChange={handleFechaFinChange}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              {formData.programaSeleccionado ? (
                <>
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-900 flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>Objetivos de Aprendizaje del Programa</span>
                      </CardTitle>
                      <CardDescription>
                        Objetivos definidos para el programa "{formData.programaSeleccionado.nombre}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {formData.programaSeleccionado.objetivos && formData.programaSeleccionado.objetivos.length > 0 ? (
                        <div className="space-y-3">
                          {formData.programaSeleccionado.objetivos
                            .sort((a, b) => a.orden - b.orden)
                            .map((objetivo, index) => (
                              <div
                                key={objetivo.id}
                                className="flex items-start space-x-3 p-3 bg-white rounded-lg border"
                              >
                                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-700">
                                  {index + 1}
                                </div>
                                <p className="text-gray-800 text-sm leading-relaxed">{objetivo.descripcion}</p>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No hay objetivos definidos para este programa</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-900 flex items-center space-x-2">
                        <Award className="h-5 w-5" />
                        <span>Competencias del Programa</span>
                      </CardTitle>
                      <CardDescription>Competencias que desarrollará el aprendiz durante el programa</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {formData.programaSeleccionado.competencias &&
                      formData.programaSeleccionado.competencias.length > 0 ? (
                        <div className="space-y-3">
                          {formData.programaSeleccionado.competencias.map((competencia) => (
                            <div key={competencia.id} className="p-3 bg-white rounded-lg border">
                              <div className="flex items-start justify-between">
                                <p className="text-gray-800 text-sm leading-relaxed flex-1">
                                  {competencia.descripcion}
                                </p>
                                {competencia.codigo && (
                                  <Badge variant="outline" className="ml-3 text-xs">
                                    {competencia.codigo}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No hay competencias definidas para este programa</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-900 flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5" />
                        <span>Resultados de Aprendizaje</span>
                      </CardTitle>
                      <CardDescription>Resultados específicos que alcanzará el aprendiz</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {formData.programaSeleccionado.resultados &&
                      formData.programaSeleccionado.resultados.length > 0 ? (
                        <div className="space-y-3">
                          {formData.programaSeleccionado.resultados.map((resultado) => (
                            <div key={resultado.id} className="p-3 bg-white rounded-lg border">
                              <div className="flex items-start justify-between">
                                <p className="text-gray-800 text-sm leading-relaxed flex-1">{resultado.descripcion}</p>
                                {resultado.codigo && (
                                  <Badge variant="outline" className="ml-3 text-xs">
                                    {resultado.codigo}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No hay resultados de aprendizaje definidos para este programa</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-amber-900">Justificación Adicional (Opcional)</CardTitle>
                      <CardDescription>
                        Agregue cualquier justificación adicional o consideraciones especiales para esta solicitud
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="justificacion">Justificación</Label>
                        <Textarea
                          id="justificacion"
                          value={formData.justificacion}
                          onChange={(e) => handleInputChange("justificacion", e.target.value)}
                          placeholder="Describa la justificación para esta solicitud de formación complementaria..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                          id="observaciones"
                          value={formData.observaciones}
                          onChange={(e) => handleInputChange("observaciones", e.target.value)}
                          placeholder="Observaciones adicionales..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Programa No Seleccionado</h3>
                    <p className="text-amber-800 mb-4">
                      Debe seleccionar un programa en el Paso 1 para ver los objetivos y competencias.
                    </p>
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="border-amber-600 text-amber-600 hover:bg-amber-100"
                    >
                      Volver al Paso 1
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-900">Resumen de la Solicitud</CardTitle>
                  <CardDescription>Revise la información antes de enviar su solicitud</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.programaSeleccionado && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-medium">Programa Seleccionado</Label>
                        <p className="text-gray-800">{formData.programaSeleccionado.nombre}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Código del Programa</Label>
                        <p className="text-gray-800">{formData.codigoPrograma}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Duración</Label>
                        <p className="text-gray-800">{formData.duracionMaxima} horas</p>
                      </div>
                      <div>
                        <Label className="font-medium">Modalidad</Label>
                        <p className="text-gray-800">{formData.modalidad}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Empresa/Entidad</Label>
                        <p className="text-gray-800">{formData.nombreEmpresa}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Lugar de Formación</Label>
                        <p className="text-gray-800">{formData.lugarFormacion}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Validaciones Finales</CardTitle>
                  <CardDescription>Confirme que ha revisado toda la información y acepta los términos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="cumpleRequisitos"
                      checked={formData.cumpleRequisitos}
                      onCheckedChange={(checked) => handleInputChange("cumpleRequisitos", checked)}
                      required
                    />
                    <Label htmlFor="cumpleRequisitos" className="text-sm leading-relaxed">
                      Confirmo que la información proporcionada es correcta y que el programa cumple con todos los
                      requisitos establecidos por el SENA para formación complementaria.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="autorizaUsoInfo"
                      checked={formData.autorizaUsoInfo}
                      onCheckedChange={(checked) => handleInputChange("autorizaUsoInfo", checked)}
                      required
                    />
                    <Label htmlFor="autorizaUsoInfo" className="text-sm leading-relaxed">
                      Autorizo el uso de la información proporcionada para los fines académicos y administrativos del
                      SENA, de acuerdo con las políticas de protección de datos.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="confirmaVeracidad"
                      checked={formData.confirmaVeracidad}
                      onCheckedChange={(checked) => handleInputChange("confirmaVeracidad", checked)}
                      required
                    />
                    <Label htmlFor="confirmaVeracidad" className="text-sm leading-relaxed">
                      Declaro bajo la gravedad del juramento que la información suministrada es veraz y me hago
                      responsable de la misma.
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              {currentStep < 5 && (
                <Button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!canProceedToNextStep()}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              {currentStep === 5 && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={submitStatus === "loading"}
                    className="flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar Borrador</span>
                  </Button>
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={!canProceedToNextStep() || submitStatus === "loading"}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                    <span>Enviar Solicitud</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {submitStatus === "error" && submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{submitError}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
