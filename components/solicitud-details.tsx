"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Calendar,
  Clock,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Edit,
  Download,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface SolicitudDetailsProps {
  solicitudId: string
}

interface Solicitud {
  id: string
  codigo: string
  estado: string
  fechaSolicitud: string
  fechaInicio?: string
  fechaFin?: string
  numeroAprendices: number
  justificacion?: string
  observaciones?: string

  // Datos de empresa
  municipio?: string
  departamento?: string
  nombreEmpresa?: string
  nitEmpresa?: string
  representanteLegal?: string
  direccionEmpresa?: string
  telefonosEmpresa?: string

  // Ambiente de formación
  lugarFormacion?: string
  tipoAmbiente?: string

  // Fechas de inscripción
  inicioInscripcion?: string
  finalizacionInscripcion?: string

  // Caracterización especial
  programaEmprendimiento?: boolean
  programaBilinguismo?: boolean
  campesenaConvenio8842?: boolean
  fullPopularConvenio8882?: boolean

  instructor: {
    name: string
    email: string
    cedula: string
    telefono?: string
    especialidad?: string
    centro: {
      nombre: string
    }
  }

  programa: {
    nombre: string
    codigo: string
    tipoFormacion: string
    modalidad: string
    duracionHoras: number
    cupoAprendices: number
    descripcion?: string
    centro: {
      nombre: string
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

  horarios: Array<{
    id: string
    diaSemana: string
    horaInicio: string
    horaFin: string
    fecha?: string
    esFlexible?: boolean
    observaciones?: string
  }>
}

const estadoColors = {
  BORRADOR: "bg-gray-100 text-gray-800",
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  EN_REVISION: "bg-blue-100 text-blue-800",
  APROBADA: "bg-green-100 text-green-800",
  RECHAZADA: "bg-red-100 text-red-800",
}

const estadoLabels = {
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En Revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
}

const diasSemanaLabels = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
}

export function SolicitudDetails({ solicitudId }: SolicitudDetailsProps) {
  const { user, token } = useAuth()
  const router = useRouter()
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSolicitud = async () => {
      if (!token) return

      try {
        setLoading(true)
        const response = await fetch(`/api/solicitudes/${solicitudId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar la solicitud")
        }

        const data = await response.json()
        setSolicitud(data.solicitud)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchSolicitud()
  }, [solicitudId, token])

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`/api/solicitudes/${solicitudId}/export?format=pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `solicitud-${solicitud?.codigo}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error al exportar PDF:", error)
    }
  }

  const canEdit = () => {
    return solicitud && ["BORRADOR", "PENDIENTE"].includes(solicitud.estado) && user?.role === "INSTRUCTOR"
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitud...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !solicitud) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar solicitud</h3>
          <p className="text-gray-600 mb-4">{error || "Solicitud no encontrada"}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalles de Solicitud</h1>
            <p className="text-gray-600">ID: {solicitud.codigo}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={estadoColors[solicitud.estado as keyof typeof estadoColors]}>
            {estadoLabels[solicitud.estado as keyof typeof estadoLabels]}
          </Badge>
          {canEdit() && (
            <Button variant="outline" onClick={() => router.push(`/editar-solicitud/${solicitud.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Información General</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Fecha de Solicitud</p>
                <p className="font-medium">{format(new Date(solicitud.fechaSolicitud), "PPP", { locale: es })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Aprendices</p>
                <p className="font-medium">{solicitud.numeroAprendices}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium">{estadoLabels[solicitud.estado as keyof typeof estadoLabels]}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Programa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Programa de Formación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{solicitud.programa.nombre}</h3>
            <p className="text-gray-600">{solicitud.programa.descripcion}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Código</p>
              <p className="font-medium">{solicitud.programa.codigo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="font-medium">{solicitud.programa.tipoFormacion}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Modalidad</p>
              <p className="font-medium">{solicitud.programa.modalidad}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duración</p>
              <p className="font-medium">{solicitud.programa.duracionHoras} horas</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Centro de Formación</p>
            <p className="font-medium">{solicitud.programa.centro.nombre}</p>
          </div>

          {/* Objetivos */}
          {solicitud.programa.objetivos.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Objetivos de Aprendizaje</h4>
              <ul className="space-y-1">
                {solicitud.programa.objetivos.map((objetivo) => (
                  <li key={objetivo.id} className="text-sm text-gray-600 flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{objetivo.descripcion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del Instructor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Instructor Responsable</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="font-medium">{solicitud.instructor.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cédula</p>
              <p className="font-medium">{solicitud.instructor.cedula}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium">{solicitud.instructor.email}</p>
              </div>
            </div>
            {solicitud.instructor.telefono && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{solicitud.instructor.telefono}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Centro de Formación</p>
            <p className="font-medium">{solicitud.instructor.centro.nombre}</p>
          </div>

          {solicitud.instructor.especialidad && (
            <div>
              <p className="text-sm text-gray-500">Especialidad</p>
              <p className="font-medium">{solicitud.instructor.especialidad}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Datos de Empresa y Ubicación */}
      {(solicitud.nombreEmpresa || solicitud.municipio) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-purple-600" />
              <span>Empresa y Ubicación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {solicitud.nombreEmpresa && (
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p className="font-medium">{solicitud.nombreEmpresa}</p>
                {solicitud.nitEmpresa && <p className="text-sm text-gray-600">NIT: {solicitud.nitEmpresa}</p>}
              </div>
            )}

            {solicitud.representanteLegal && (
              <div>
                <p className="text-sm text-gray-500">Representante Legal</p>
                <p className="font-medium">{solicitud.representanteLegal}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {(solicitud.municipio || solicitud.departamento) && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="font-medium">
                      {[solicitud.municipio, solicitud.departamento].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {solicitud.direccionEmpresa && (
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">{solicitud.direccionEmpresa}</p>
                </div>
              )}
            </div>

            {solicitud.lugarFormacion && (
              <div>
                <p className="text-sm text-gray-500">Lugar de Formación</p>
                <p className="font-medium">{solicitud.lugarFormacion}</p>
                {solicitud.tipoAmbiente && <p className="text-sm text-gray-600">Tipo: {solicitud.tipoAmbiente}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fechas y Programación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span>Fechas y Programación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {solicitud.inicioInscripcion && (
              <div>
                <p className="text-sm text-gray-500">Inicio de Inscripción</p>
                <p className="font-medium">{format(new Date(solicitud.inicioInscripcion), "PPP", { locale: es })}</p>
              </div>
            )}
            {solicitud.finalizacionInscripcion && (
              <div>
                <p className="text-sm text-gray-500">Fin de Inscripción</p>
                <p className="font-medium">
                  {format(new Date(solicitud.finalizacionInscripcion), "PPP", { locale: es })}
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {solicitud.fechaInicio && (
              <div>
                <p className="text-sm text-gray-500">Inicio del Curso</p>
                <p className="font-medium">{format(new Date(solicitud.fechaInicio), "PPP", { locale: es })}</p>
              </div>
            )}
            {solicitud.fechaFin && (
              <div>
                <p className="text-sm text-gray-500">Fin del Curso</p>
                <p className="font-medium">{format(new Date(solicitud.fechaFin), "PPP", { locale: es })}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Horarios */}
      {solicitud.horarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Horarios de Formación</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {solicitud.horarios.map((horario) => (
                <div key={horario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">
                        {diasSemanaLabels[horario.diaSemana as keyof typeof diasSemanaLabels]}
                      </p>
                      {horario.fecha && (
                        <p className="text-sm text-gray-600">
                          {format(new Date(horario.fecha), "PPP", { locale: es })}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {horario.horaInicio} - {horario.horaFin}
                      </p>
                    </div>
                  </div>
                  {horario.observaciones && (
                    <div className="text-sm text-gray-500 max-w-xs">{horario.observaciones}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Justificación */}
      {solicitud.justificacion && (
        <Card>
          <CardHeader>
            <CardTitle>Justificación Académica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{solicitud.justificacion}</p>
          </CardContent>
        </Card>
      )}

      {/* Observaciones */}
      {solicitud.observaciones && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{solicitud.observaciones}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
