"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, Eye, Clock, User, Calendar, FileText, MessageSquare } from "lucide-react"

interface SolicitudPendiente {
  id: string
  numeroFicha: string
  nombreCurso: string
  instructor: string
  centro: string
  fechaSolicitud: string
  fechaInicio: string
  duracionHoras: number
  modalidad: string
  justificacion: string
  objetivos: string[]
  competencias: string[]
  estado: "pendiente" | "en_revision"
}

const solicitudesPendientes: SolicitudPendiente[] = [
  {
    id: "SOL-2024-045",
    numeroFicha: "2024045",
    nombreCurso: "Excel Avanzado para Análisis de Datos",
    instructor: "Ana María Pérez",
    centro: "Centro de Gestión Agroempresarial del Oriente",
    fechaSolicitud: "2024-01-20",
    fechaInicio: "2024-02-15",
    duracionHoras: 40,
    modalidad: "Presencial",
    justificacion:
      "Los instructores del área de administración requieren fortalecer sus competencias en análisis de datos para mejorar la calidad de la formación en programas relacionados con gestión empresarial.",
    objetivos: [
      "Dominar funciones avanzadas de Excel para análisis de datos",
      "Crear dashboards interactivos para presentación de información",
      "Aplicar herramientas de análisis estadístico en Excel",
    ],
    competencias: [
      "Análisis de datos empresariales",
      "Creación de reportes automatizados",
      "Interpretación de indicadores de gestión",
    ],
    estado: "pendiente",
  },
  {
    id: "SOL-2024-046",
    numeroFicha: "2024046",
    nombreCurso: "Fundamentos de Programación Python",
    instructor: "Carlos Rodríguez",
    centro: "Centro de Biotecnología Agropecuaria",
    fechaSolicitud: "2024-01-19",
    fechaInicio: "2024-03-01",
    duracionHoras: 60,
    modalidad: "Virtual",
    justificacion:
      "La automatización de procesos en biotecnología requiere conocimientos básicos de programación. Este curso permitirá a los instructores incorporar herramientas tecnológicas en sus programas de formación.",
    objetivos: [
      "Comprender los fundamentos de la programación",
      "Desarrollar scripts básicos para automatización",
      "Aplicar Python en análisis de datos biológicos",
    ],
    competencias: ["Programación básica", "Automatización de procesos", "Análisis de datos científicos"],
    estado: "en_revision",
  },
]

export function SolicitudesPendientes() {
  const [solicitudes, setSolicitudes] = useState(solicitudesPendientes)
  const [comentarios, setComentarios] = useState<{ [key: string]: string }>({})

  const handleApprove = (id: string) => {
    setSolicitudes((prev) => prev.filter((s) => s.id !== id))
    console.log(`Solicitud ${id} aprobada`)
  }

  const handleReject = (id: string) => {
    setSolicitudes((prev) => prev.filter((s) => s.id !== id))
    console.log(`Solicitud ${id} rechazada con comentario: ${comentarios[id] || ""}`)
  }

  const handleSetInReview = (id: string) => {
    setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado: "en_revision" as const } : s)))
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {solicitudes.filter((s) => s.estado === "pendiente").length}
            </div>
            <div className="text-sm text-gray-600">Pendientes de Revisión</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {solicitudes.filter((s) => s.estado === "en_revision").length}
            </div>
            <div className="text-sm text-gray-600">En Revisión</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-sm text-gray-600">Aprobadas Este Mes</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Solicitudes */}
      <div className="space-y-4">
        {solicitudes.map((solicitud) => (
          <Card key={solicitud.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{solicitud.nombreCurso}</h3>
                    <Badge
                      className={
                        solicitud.estado === "pendiente" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                      }
                    >
                      {solicitud.estado === "pendiente" ? "Pendiente" : "En Revisión"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-1">
                    Solicitud: {solicitud.id} • Ficha: {solicitud.numeroFicha}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{solicitud.nombreCurso}</DialogTitle>
                        <DialogDescription>Revisión detallada de la solicitud {solicitud.id}</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Información del Instructor */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Información del Instructor</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Nombre:</span> {solicitud.instructor}
                              </p>
                              <p>
                                <span className="font-medium">Centro:</span> {solicitud.centro}
                              </p>
                              <p>
                                <span className="font-medium">Fecha de Solicitud:</span>{" "}
                                {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-CO")}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Detalles del Curso</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Duración:</span> {solicitud.duracionHoras} horas
                              </p>
                              <p>
                                <span className="font-medium">Modalidad:</span> {solicitud.modalidad}
                              </p>
                              <p>
                                <span className="font-medium">Fecha de Inicio:</span>{" "}
                                {new Date(solicitud.fechaInicio).toLocaleDateString("es-CO")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Justificación */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Justificación</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{solicitud.justificacion}</p>
                        </div>

                        {/* Objetivos */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Objetivos de Aprendizaje</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {solicitud.objetivos.map((objetivo, index) => (
                              <li key={index}>{objetivo}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Competencias */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Competencias a Desarrollar</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {solicitud.competencias.map((competencia, index) => (
                              <li key={index}>{competencia}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Comentarios */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Comentarios de Revisión</h4>
                          <Textarea
                            placeholder="Agrega comentarios sobre esta solicitud..."
                            value={comentarios[solicitud.id] || ""}
                            onChange={(e) =>
                              setComentarios((prev) => ({
                                ...prev,
                                [solicitud.id]: e.target.value,
                              }))
                            }
                            rows={3}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Información Resumida */}
              <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{solicitud.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{solicitud.duracionHoras} horas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Inicio: {new Date(solicitud.fechaInicio).toLocaleDateString("es-CO")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>{solicitud.modalidad}</span>
                </div>
              </div>

              {/* Justificación Resumida */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-2">{solicitud.justificacion}</p>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Solicitada hace{" "}
                    {Math.floor((Date.now() - new Date(solicitud.fechaSolicitud).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                    días
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {solicitud.estado === "pendiente" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetInReview(solicitud.id)}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Marcar en Revisión
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(solicitud.id)}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(solicitud.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {solicitudes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Excelente trabajo!</h3>
            <p className="text-gray-600">No hay solicitudes pendientes de revisión en este momento.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
