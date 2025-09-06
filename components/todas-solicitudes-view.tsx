"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Eye,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  User,
  Building,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { SolicitudDetalleModal } from "@/components/solicitud-detalle-modal"

interface Solicitud {
  id: string
  codigo: string
  estado: string
  fechaSolicitud: string
  numeroAprendicesInscribir: number
  nombreEmpresa: string
  justificacion: string
  numeroFicha?: string
  instructor: {
    name: string
    email: string
    especialidad?: string
  }
  programa: {
    nombre: string
    codigo: string
    duracionHoras: number
    modalidad: string
    centro: {
      nombre: string
    }
  }
}

export function TodasSolicitudesView() {
  const { token } = useAuth()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [fechaFilter, setFechaFilter] = useState("")
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (token) {
      loadSolicitudes()
    }
  }, [token, estadoFilter, fechaFilter])

  const loadSolicitudes = async () => {
    if (!token) return

    setLoading(true)
    try {
      let url = "/api/solicitudes?limit=100"

      if (estadoFilter !== "all") {
        url += `&estado=${estadoFilter}`
      }
      if (fechaFilter) {
        url += `&fechaInicio=${fechaFilter}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSolicitudes(data.solicitudes || [])
      } else {
        console.error("Error loading solicitudes:", response.statusText)
      }
    } catch (error) {
      console.error("Error loading solicitudes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const matchesSearch =
      solicitud.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.programa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

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
      case "BORRADOR":
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>
      case "EN_REVISION":
        return <Badge className="bg-blue-100 text-blue-800">En Revisión</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const handleVerDetalles = (solicitudId: string) => {
    setSelectedSolicitudId(solicitudId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedSolicitudId(null)
    setIsModalOpen(false)
  }

  const estadisticas = {
    total: solicitudes.length,
    pendientes: solicitudes.filter((s) => s.estado === "PENDIENTE").length,
    aprobadas: solicitudes.filter((s) => s.estado === "APROBADA").length,
    rechazadas: solicitudes.filter((s) => s.estado === "RECHAZADA").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="ml-3 text-gray-600">Cargando solicitudes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
            <div className="text-sm text-gray-600">Total Solicitudes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{estadisticas.aprobadas}</div>
            <div className="text-sm text-gray-600">Aprobadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{estadisticas.rechazadas}</div>
            <div className="text-sm text-gray-600">Rechazadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Todas las Solicitudes</span>
            </div>
            <Button onClick={loadSolicitudes} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </CardTitle>
          <CardDescription>Gestiona todas las solicitudes de formación complementaria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar solicitudes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                <SelectItem value="APROBADA">Aprobadas</SelectItem>
                <SelectItem value="RECHAZADA">Rechazadas</SelectItem>
                <SelectItem value="BORRADOR">Borradores</SelectItem>
                <SelectItem value="EN_REVISION">En Revisión</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Fecha"
              value={fechaFilter}
              onChange={(e) => setFechaFilter(e.target.value)}
            />

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setEstadoFilter("all")
                setFechaFilter("")
              }}
            >
              <Filter className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          </div>

          {/* Lista de Solicitudes */}
          <div className="space-y-4">
            {filteredSolicitudes.map((solicitud) => (
              <Card key={solicitud.id} className="border-l-4 border-l-blue-400 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">{solicitud.codigo}</h4>
                        {getStatusBadge(solicitud.estado)}
                        <Badge className="bg-blue-100 text-blue-800">
                          {solicitud.numeroAprendicesInscribir} aprendices
                        </Badge>
                        {solicitud.numeroFicha && (
                          <Badge className="bg-purple-100 text-purple-800">Ficha: {solicitud.numeroFicha}</Badge>
                        )}
                      </div>

                      <h5 className="text-md font-medium text-gray-800 mb-2">{solicitud.programa.nombre}</h5>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{solicitud.instructor.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{solicitud.nombreEmpresa}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(solicitud.fechaSolicitud), "dd/MM/yyyy", { locale: es })}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{solicitud.justificacion}</p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleVerDetalles(solicitud.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredSolicitudes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron solicitudes</h3>
                <p className="text-gray-600">
                  {searchTerm || estadoFilter !== "all" || fechaFilter
                    ? "Intenta ajustar los filtros de búsqueda."
                    : "No hay solicitudes registradas en el sistema."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      {selectedSolicitudId && (
        <SolicitudDetalleModal
          solicitudId={selectedSolicitudId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onApprove={async () => {
            await loadSolicitudes()
            handleCloseModal()
          }}
          onReject={async () => {
            await loadSolicitudes()
            handleCloseModal()
          }}
        />
      )}
    </div>
  )
}
