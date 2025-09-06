"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, Eye, Users, Calendar, Building, Search, Filter } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { SolicitudDetalleModal } from "./solicitud-detalle-modal"

interface SolicitudPendiente {
  id: string
  codigo: string
  estado: string
  fechaSolicitud: string
  fechaInicioCurso: string
  numeroAprendicesInscribir: number
  nombreEmpresa: string
  justificacion: string
  instructor: {
    name: string
    email: string
    cedula: string
  }
  programa: {
    nombre: string
    codigo: string
    duracionHoras: number
    modalidad: string
  }
}

export function SolicitudesPendientes() {
  const { token, user } = useAuth()
  const [solicitudes, setSolicitudes] = useState<SolicitudPendiente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [selectedSolicitud, setSelectedSolicitud] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [comentarios, setComentarios] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (token) {
      loadSolicitudesPendientes()
    }
  }, [token])

  const loadSolicitudesPendientes = async () => {
    setLoading(true)
    try {
      let url = "/api/solicitudes?limit=100"
      if (estadoFilter !== "all") {
        url += `&estado=${estadoFilter}`
      } else {
        url += "&estado=PENDIENTE,EN_REVISION"
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSolicitudes(data.solicitudes || [])
      }
    } catch (error) {
      console.error("Error loading solicitudes pendientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string, comentarios: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/solicitudes/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comentarios }),
      })

      if (response.ok) {
        await loadSolicitudesPendientes()
        setShowModal(false)
        setSelectedSolicitud(null)
        setComentarios("")
      }
    } catch (error) {
      console.error("Error approving solicitud:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (id: string, comentarios: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/solicitudes/${id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comentarios }),
      })

      if (response.ok) {
        await loadSolicitudesPendientes()
        setShowModal(false)
        setSelectedSolicitud(null)
        setComentarios("")
      }
    } catch (error) {
      console.error("Error rejecting solicitud:", error)
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
      case "EN_REVISION":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            En Revisión
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const filteredSolicitudes = solicitudes.filter(
    (solicitud) =>
      solicitud.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.programa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendientesCount = solicitudes.filter((s) => s.estado === "PENDIENTE").length
  const enRevisionCount = solicitudes.filter((s) => s.estado === "EN_REVISION").length
  const thisMonth = new Date()
  thisMonth.setDate(1)
  const aprobadasEsteMes = 18 // This would need a separate API call for approved this month

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitudes pendientes...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Solicitudes Pendientes</h2>
              <p className="text-gray-600 mt-1">
                Revisa y gestiona las solicitudes de formación complementaria que requieren tu aprobación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{pendientesCount}</div>
            <div className="text-sm text-gray-600">Pendientes de Revisión</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{enRevisionCount}</div>
            <div className="text-sm text-gray-600">En Revisión</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{aprobadasEsteMes}</div>
            <div className="text-sm text-gray-600">Aprobadas Este Mes</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de búsqueda y filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por código, programa, instructor o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setEstadoFilter(estadoFilter === "all" ? "PENDIENTE" : "all")}>
              <Filter className="h-4 w-4 mr-2" />
              {estadoFilter === "all" ? "Todas" : "Solo Pendientes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Solicitudes */}
      <div className="space-y-4">
        {filteredSolicitudes.map((solicitud) => (
          <Card key={solicitud.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{solicitud.codigo}</h3>
                    {getStatusBadge(solicitud.estado)}
                    <Badge className="bg-blue-100 text-blue-800">
                      {solicitud.numeroAprendicesInscribir} aprendices
                    </Badge>
                  </div>

                  <h4 className="text-md font-medium text-gray-800 mb-2">{solicitud.programa.nombre}</h4>

                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Instructor: {solicitud.instructor.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>Empresa: {solicitud.nombreEmpresa}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Inicio: {format(new Date(solicitud.fechaInicioCurso), "PPP", { locale: es })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Duración: {solicitud.programa.duracionHoras}h</span>
                    </div>
                  </div>

                  {solicitud.justificacion && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-medium text-gray-900 mb-2">Justificación:</h6>
                      <p className="text-sm text-gray-700 line-clamp-3">{solicitud.justificacion}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSolicitud(solicitud.id)
                      setShowModal(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSolicitudes.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No se encontraron solicitudes" : "¡Excelente trabajo!"}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "No hay solicitudes que coincidan con tu búsqueda."
                : "No hay solicitudes pendientes de revisión en este momento."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles */}
      <SolicitudDetalleModal
        solicitudId={selectedSolicitud}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedSolicitud(null)
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        userRole={user?.role}
      />
    </div>
  )
}
