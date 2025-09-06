"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, User, Building, Calendar, FileText, Award, Target, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface SolicitudDetalle {
  id: string
  codigo: string
  estado: string
  fechaCaracterizacion: string
  responsableNombre: string
  responsableCedula: string
  responsableEmail: string
  codigoPrograma: string
  versionPrograma: string
  duracionMaxima: number
  cupoMaximo: number
  numeroAprendicesInscribir: number
  modalidad: string
  municipio: string
  departamento: string
  nombreEmpresa: string
  nitEmpresa?: string
  representanteLegal: string
  direccionEmpresa: string
  lugarFormacion: string
  tipoAmbiente: string
  inicioInscripcion: string
  finalizacionInscripcion: string
  fechaInicioCurso: string
  fechaFinalizacionCurso: string
  justificacion: string
  observaciones?: string
  numeroFicha?: string
  comentariosRevision?: string
  fechaAprobacion?: string
  fechaRevision?: string
  createdAt: string
  instructor: {
    name: string
    email: string
    cedula: string
    especialidad?: string
  }
  programa: {
    nombre: string
    codigo: string
    duracionHoras: number
    modalidad: string
    descripcion?: string
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
    observaciones?: string
  }>
  // Caracterización de programas especiales
  programaEmprendimiento: boolean
  programaBilinguismo: boolean
  atencionInstituciones: boolean
  posconflicto: boolean
  senaEmprendeRural: boolean
  formacionEspecialMypimes: boolean
  senaEmprendeRuralPosconflicto: boolean
  tecnoacademiaSennova: boolean
  campesenaConvenio8842: boolean
  fullPopularConvenio8882: boolean
  icbfInstituto: boolean
  policiaNacional: boolean
  otroEspecificar?: string
}

interface SolicitudDetalleModalProps {
  solicitudId: string | null
  isOpen: boolean
  onClose: () => void
  onApprove?: (id: string, comentarios: string) => void
  onReject?: (id: string, comentarios: string) => void
  userRole?: string
}

export function SolicitudDetalleModal({
  solicitudId,
  isOpen,
  onClose,
  onApprove,
  onReject,
  userRole,
}: SolicitudDetalleModalProps) {
  const { token } = useAuth()
  const [solicitud, setSolicitud] = useState<SolicitudDetalle | null>(null)
  const [loading, setLoading] = useState(false)
  const [comentarios, setComentarios] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (solicitudId && isOpen) {
      loadSolicitudDetalle()
    }
  }, [solicitudId, isOpen])

  const loadSolicitudDetalle = async () => {
    if (!token || !solicitudId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/solicitudes/${solicitudId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSolicitud(data.solicitud)
      }
    } catch (error) {
      console.error("Error loading solicitud details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!solicitud || !onApprove) return

    setActionLoading(true)
    try {
      await onApprove(solicitud.id, comentarios)
      onClose()
    } catch (error) {
      console.error("Error approving:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!solicitud || !onReject) return

    setActionLoading(true)
    try {
      await onReject(solicitud.id, comentarios)
      onClose()
    } catch (error) {
      console.error("Error rejecting:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "APROBADA":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobada
          </Badge>
        )
      case "RECHAZADA":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazada
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getProgramasEspeciales = () => {
    if (!solicitud) return []

    const programas = []
    if (solicitud.programaEmprendimiento) programas.push("Programa de Emprendimiento")
    if (solicitud.programaBilinguismo) programas.push("Programa de Bilingüismo")
    if (solicitud.atencionInstituciones) programas.push("Atención a Instituciones")
    if (solicitud.posconflicto) programas.push("Posconflicto")
    if (solicitud.senaEmprendeRural) programas.push("SENA Emprende Rural")
    if (solicitud.formacionEspecialMypimes) programas.push("Formación Especial MYPIMES - PNA")
    if (solicitud.senaEmprendeRuralPosconflicto) programas.push("SENA Emprende Rural Posconflicto")
    if (solicitud.tecnoacademiaSennova) programas.push("Tecnoacademia - SENNOVA")
    if (solicitud.campesenaConvenio8842) programas.push("CAMPESENA - Convenio 8842")
    if (solicitud.fullPopularConvenio8882) programas.push("Full Popular - Convenio 8882")
    if (solicitud.icbfInstituto) programas.push("ICBF")
    if (solicitud.policiaNacional) programas.push("Policía Nacional")
    if (solicitud.otroEspecificar) programas.push(`Otro: ${solicitud.otroEspecificar}`)

    return programas
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Detalle de Solicitud</span>
          </DialogTitle>
          <DialogDescription>Información completa de la solicitud de formación complementaria</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="ml-3 text-gray-600">Cargando detalles...</p>
          </div>
        ) : solicitud ? (
          <div className="space-y-6">
            {/* Header con información básica */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{solicitud.codigo}</CardTitle>
                    <CardDescription>{solicitud.programa.nombre}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(solicitud.estado)}
                    {solicitud.numeroFicha && (
                      <Badge className="bg-blue-100 text-blue-800">Ficha: {solicitud.numeroFicha}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Información del Instructor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Información del Instructor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Nombre</Label>
                  <p className="text-gray-800">{solicitud.instructor.name}</p>
                </div>
                <div>
                  <Label className="font-medium">Cédula</Label>
                  <p className="text-gray-800">{solicitud.instructor.cedula}</p>
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <p className="text-gray-800">{solicitud.instructor.email}</p>
                </div>
                <div>
                  <Label className="font-medium">Especialidad</Label>
                  <p className="text-gray-800">{solicitud.instructor.especialidad || "No especificada"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Programa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Información del Programa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="font-medium">Código</Label>
                    <p className="text-gray-800">{solicitud.codigoPrograma}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Duración</Label>
                    <p className="text-gray-800">{solicitud.duracionMaxima} horas</p>
                  </div>
                  <div>
                    <Label className="font-medium">Modalidad</Label>
                    <p className="text-gray-800">{solicitud.modalidad}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Cupo Máximo</Label>
                    <p className="text-gray-800">{solicitud.cupoMaximo} aprendices</p>
                  </div>
                  <div>
                    <Label className="font-medium">Aprendices a Inscribir</Label>
                    <p className="text-gray-800">{solicitud.numeroAprendicesInscribir}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Versión</Label>
                    <p className="text-gray-800">{solicitud.versionPrograma}</p>
                  </div>
                </div>

                {solicitud.programa.descripcion && (
                  <div>
                    <Label className="font-medium">Descripción</Label>
                    <p className="text-gray-800 text-sm">{solicitud.programa.descripcion}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de la Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Información de la Empresa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Nombre de la Empresa</Label>
                  <p className="text-gray-800">{solicitud.nombreEmpresa}</p>
                </div>
                <div>
                  <Label className="font-medium">Representante Legal</Label>
                  <p className="text-gray-800">{solicitud.representanteLegal}</p>
                </div>
                <div>
                  <Label className="font-medium">Ubicación</Label>
                  <p className="text-gray-800">
                    {solicitud.municipio}, {solicitud.departamento}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Dirección</Label>
                  <p className="text-gray-800">{solicitud.direccionEmpresa}</p>
                </div>
                <div>
                  <Label className="font-medium">Lugar de Formación</Label>
                  <p className="text-gray-800">{solicitud.lugarFormacion}</p>
                </div>
                <div>
                  <Label className="font-medium">Tipo de Ambiente</Label>
                  <p className="text-gray-800">{solicitud.tipoAmbiente}</p>
                </div>
                {solicitud.nitEmpresa && (
                  <div>
                    <Label className="font-medium">NIT</Label>
                    <p className="text-gray-800">{solicitud.nitEmpresa}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Programas Especiales */}
            {getProgramasEspeciales().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Programas Especiales o Convenios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {getProgramasEspeciales().map((programa, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {programa}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fechas y Horarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Programación</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Inicio de Inscripción</Label>
                    <p className="text-gray-800">
                      {format(new Date(solicitud.inicioInscripcion), "PPP", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Fin de Inscripción</Label>
                    <p className="text-gray-800">
                      {format(new Date(solicitud.finalizacionInscripcion), "PPP", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Inicio del Curso</Label>
                    <p className="text-gray-800">
                      {format(new Date(solicitud.fechaInicioCurso), "PPP", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Fin del Curso</Label>
                    <p className="text-gray-800">
                      {format(new Date(solicitud.fechaFinalizacionCurso), "PPP", { locale: es })}
                    </p>
                  </div>
                </div>

                {solicitud.horarios.length > 0 && (
                  <div>
                    <Label className="font-medium">Horarios Detallados</Label>
                    <div className="mt-2 space-y-3">
                      {solicitud.horarios.map((horario) => (
                        <div key={horario.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{horario.diaSemana}</span>
                            <span className="text-sm font-medium text-gray-700">
                              {horario.horaInicio} - {horario.horaFin}
                            </span>
                          </div>
                          {horario.fecha && (
                            <div className="text-sm text-gray-600 mb-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              Fecha específica: {format(new Date(horario.fecha), "PPP", { locale: es })}
                            </div>
                          )}
                          {horario.observaciones && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Observaciones:</span> {horario.observaciones}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Objetivos y Competencias */}
            {solicitud.programa.objetivos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Objetivos de Aprendizaje</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {solicitud.programa.objetivos
                      .sort((a, b) => a.orden - b.orden)
                      .map((objetivo, index) => (
                        <div key={objetivo.id} className="flex items-start space-x-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-700">
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-800">{objetivo.descripcion}</p>
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
                  <CardTitle>Justificación</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800 text-sm leading-relaxed">{solicitud.justificacion}</p>
                </CardContent>
              </Card>
            )}

            {/* Comentarios de Revisión */}
            {solicitud.comentariosRevision && (
              <Card>
                <CardHeader>
                  <CardTitle>Comentarios de Revisión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800 text-sm leading-relaxed">{solicitud.comentariosRevision}</p>
                  {solicitud.fechaRevision && (
                    <p className="text-xs text-gray-500 mt-2">
                      Revisado el {format(new Date(solicitud.fechaRevision), "PPP", { locale: es })}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Acciones del Coordinador */}
            {userRole === "COORDINADOR" && solicitud.estado === "PENDIENTE" && (
              <Card>
                <CardHeader>
                  <CardTitle>Acciones de Coordinador</CardTitle>
                  <CardDescription>Agregue comentarios y tome una decisión sobre esta solicitud</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="comentarios">Comentarios</Label>
                    <Textarea
                      id="comentarios"
                      value={comentarios}
                      onChange={(e) => setComentarios(e.target.value)}
                      placeholder="Agregue comentarios sobre la revisión de esta solicitud..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar Solicitud
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={actionLoading}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rechazar Solicitud
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No se pudo cargar la información de la solicitud</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
