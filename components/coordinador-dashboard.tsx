"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  UserPlus,
  Search,
  Eye,
  FileText,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Filter,
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
  fechaInicio: string
  fechaFin: string
  numeroAprendices: number
  nombreEmpresa: string
  justificacion: string
  createdAt: string
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
  horarios: Array<{
    id: string
    diaSemana: string
    horaInicio: string
    horaFin: string
  }>
}

interface Instructor {
  id: string
  name: string
  email: string
  cedula: string
  telefono?: string
  especialidad?: string
  fechaIngreso?: string
  estado: string
  fichasAsignadas: Array<{
    numero: string
    programa: string
    aprendices: number
  }>
  solicitudesFormacion: number
  horasFormacion: number
}

export function CoordinadorDashboard() {
  const { user, token } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false)
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [instructores, setInstructores] = useState<Instructor[]>([])
  const [estadisticas, setEstadisticas] = useState({
    solicitudesPendientes: 0,
    totalInstructores: 0,
    instructoresActivos: 0,
    totalSolicitudesActivas: 0,
    totalAprendices: 0,
  })

  useEffect(() => {
    if (user && token) {
      loadDashboardData()
    }
  }, [user, token])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadSolicitudes(), loadInstructores()])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSolicitudes = async () => {
    if (!token) return

    setLoadingSolicitudes(true)
    try {
      const estadoParam = estadoFilter !== "all" ? `&estado=${estadoFilter}` : ""
      const response = await fetch(`/api/solicitudes?limit=50${estadoParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSolicitudes(data.solicitudes || [])

        const pendientes = data.solicitudes?.filter((s: Solicitud) => s.estado === "PENDIENTE").length || 0
        const activas =
          data.solicitudes?.filter((s: Solicitud) => ["APROBADA", "EN_CURSO"].includes(s.estado)).length || 0
        const totalAprendices =
          data.solicitudes?.reduce((sum: number, s: Solicitud) => sum + s.numeroAprendices, 0) || 0

        setEstadisticas((prev) => ({
          ...prev,
          solicitudesPendientes: pendientes,
          totalSolicitudesActivas: activas,
          totalAprendices,
        }))
      }
    } catch (error) {
      console.error("Error loading solicitudes:", error)
    } finally {
      setLoadingSolicitudes(false)
    }
  }

  const loadInstructores = async () => {
    if (!token) return

    try {
      // For now, we'll use mock data but structure it properly
      const mockInstructores: Instructor[] = [
        {
          id: "INST-001",
          name: "María González Pérez",
          email: "maria.gonzalez@sena.edu.co",
          cedula: "1234567890",
          telefono: "+57 300 123 4567",
          especialidad: "Análisis y Desarrollo de Software",
          fechaIngreso: "2023-03-15",
          estado: "activo",
          fichasAsignadas: [
            { numero: "2023-045", programa: "Tecnólogo en Análisis y Desarrollo de Software", aprendices: 25 },
          ],
          solicitudesFormacion: 2,
          horasFormacion: 120,
        },
        {
          id: "INST-002",
          name: "Ana María Pérez López",
          email: "ana.perez@sena.edu.co",
          cedula: "0987654321",
          telefono: "+57 301 234 5678",
          especialidad: "Biotecnología Agropecuaria",
          fechaIngreso: "2023-01-20",
          estado: "activo",
          fichasAsignadas: [{ numero: "2023-046", programa: "Técnico en Biotecnología", aprendices: 20 }],
          solicitudesFormacion: 1,
          horasFormacion: 80,
        },
      ]

      setInstructores(mockInstructores)
      setEstadisticas((prev) => ({
        ...prev,
        totalInstructores: mockInstructores.length,
        instructoresActivos: mockInstructores.filter((i) => i.estado === "activo").length,
      }))
    } catch (error) {
      console.error("Error loading instructores:", error)
    }
  }

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const matchesSearch =
      solicitud.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.programa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = estadoFilter === "all" || solicitud.estado === estadoFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  const filteredInstructores = instructores.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.cedula.includes(searchTerm) ||
      (instructor.especialidad && instructor.especialidad.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAprobarSolicitud = async (solicitudId: string) => {
    if (!token) return

    const comentarios = prompt("Ingrese comentarios adicionales para la aprobación (opcional):")

    try {
      const response = await fetch(`/api/solicitudes/${solicitudId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentarios }),
      })

      if (response.ok) {
        const data = await response.json()
        await loadSolicitudes() // Reload data
        alert(`Solicitud aprobada exitosamente. Número de ficha asignado: ${data.solicitud.numeroFicha}`)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error approving solicitud:", error)
      alert("Error al aprobar la solicitud")
    }
  }

  const handleRechazarSolicitud = async (solicitudId: string) => {
    if (!token) return

    const comentarios = prompt("Ingrese los comentarios para el rechazo (opcional):")

    try {
      const response = await fetch(`/api/solicitudes/${solicitudId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentarios }),
      })

      if (response.ok) {
        await loadSolicitudes() // Reload data
        alert("Solicitud rechazada exitosamente")
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error rejecting solicitud:", error)
      alert("Error al rechazar la solicitud")
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

  const handleModalApprove = async (id: string, comentarios: string) => {
    const response = await fetch(`/api/solicitudes/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comentarios }),
    })

    if (response.ok) {
      const data = await response.json()
      await loadSolicitudes()
      alert(`Solicitud aprobada exitosamente. Número de ficha asignado: ${data.solicitud.numeroFicha}`)
    } else {
      const errorData = await response.json()
      alert(`Error: ${errorData.error}`)
    }
  }

  const handleModalReject = async (id: string, comentarios: string) => {
    const response = await fetch(`/api/solicitudes/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comentarios }),
    })

    if (response.ok) {
      await loadSolicitudes()
      alert("Solicitud rechazada exitosamente")
    } else {
      const errorData = await response.json()
      alert(`Error: ${errorData.error}`)
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
      case "BORRADOR":
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>
      case "EN_CURSO":
        return <Badge className="bg-blue-100 text-blue-800">En Curso</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="ml-3 text-gray-600">Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header de Bienvenida */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido, {user?.name}!</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Building className="h-4 w-4 text-gray-600" />
                <p className="text-gray-600">{user?.centro?.nombre}</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Gestiona las solicitudes de formación complementaria e instructores de tu centro
              </p>
            </div>
            <div className="text-right">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Registrar Instructor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Solicitudes Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.solicitudesPendientes}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Instructores</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalInstructores}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Solicitudes Activas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalSolicitudesActivas}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Aprendices</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalAprendices}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.instructoresActivos}</p>
              </div>
              <Users className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <Tabs defaultValue="solicitudes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="solicitudes" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Gestionar Solicitudes</span>
          </TabsTrigger>
          <TabsTrigger value="registro" className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Registrar Instructores</span>
          </TabsTrigger>
          <TabsTrigger value="instructores" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Ver Instructores</span>
          </TabsTrigger>
        </TabsList>

        {/* Pestaña 1: Gestionar Solicitudes */}
        <TabsContent value="solicitudes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Solicitudes de Formación Complementaria</span>
              </CardTitle>
              <CardDescription>Revisa, aprueba o rechaza las solicitudes de formación de tu centro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por código, programa, instructor o empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">Pendientes</SelectItem>
                      <SelectItem value="aprobada">Aprobadas</SelectItem>
                      <SelectItem value="rechazada">Rechazadas</SelectItem>
                      <SelectItem value="borrador">Borradores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={loadSolicitudes} disabled={loadingSolicitudes} variant="outline">
                  {loadingSolicitudes ? "Cargando..." : "Actualizar"}
                </Button>
              </div>

              <div className="space-y-4">
                {filteredSolicitudes.map((solicitud) => (
                  <Card key={solicitud.id} className="border-l-4 border-l-blue-400 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{solicitud.codigo}</h4>
                            {getStatusBadge(solicitud.estado)}
                            <Badge className="bg-blue-100 text-blue-800">{solicitud.numeroAprendices} aprendices</Badge>
                          </div>

                          <h5 className="text-md font-medium text-gray-800 mb-2">{solicitud.programa.nombre}</h5>

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
                              <span>Inicio: {format(new Date(solicitud.fechaInicio), "PPP", { locale: es })}</span>
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
                          {solicitud.estado === "PENDIENTE" && (
                            <>
                              <Button
                                onClick={() => handleAprobarSolicitud(solicitud.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                onClick={() => handleRechazarSolicitud(solicitud.id)}
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                                size="sm"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleVerDetalles(solicitud.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredSolicitudes.length === 0 && !loadingSolicitudes && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm || estadoFilter !== "all" ? "No se encontraron solicitudes" : "No hay solicitudes"}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || estadoFilter !== "all"
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "Las solicitudes de formación aparecerán aquí cuando los instructores las envíen"}
                    </p>
                  </div>
                )}

                {loadingSolicitudes && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Cargando solicitudes...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña 2: Registrar Instructores */}
        <TabsContent value="registro" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-green-600" />
                <span>Registrar Nuevo Instructor</span>
              </CardTitle>
              <CardDescription>Registra instructores para tu centro de formación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Formulario de Registro</h3>
                <p className="text-gray-600 mb-6">Aquí aparecerá el formulario para registrar nuevos instructores</p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Abrir Formulario de Registro
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña 3: Ver Instructores */}
        <TabsContent value="instructores" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Información de Instructores</span>
              </CardTitle>
              <CardDescription>Consulta la información detallada de los instructores de tu centro</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Barra de Búsqueda */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar instructor por nombre, cédula o especialidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Lista de Instructores */}
              <div className="space-y-4">
                {filteredInstructores.map((instructor) => (
                  <Card key={instructor.id} className="border-l-4 border-l-blue-400 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{instructor.name}</h4>
                            <Badge className="bg-green-100 text-green-800">✅ {instructor.estado}</Badge>
                            <Badge className="bg-blue-100 text-blue-800">{instructor.especialidad}</Badge>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{instructor.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{instructor.telefono}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Desde{" "}
                                {instructor.fechaIngreso
                                  ? format(new Date(instructor.fechaIngreso), "PPP", { locale: es })
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Fichas Asignadas */}
                          {instructor.fichasAsignadas.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>Fichas Asignadas ({instructor.fichasAsignadas.length})</span>
                              </h5>
                              <div className="space-y-2">
                                {instructor.fichasAsignadas.map((ficha, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between text-sm bg-white rounded p-2"
                                  >
                                    <div>
                                      <span className="font-medium text-gray-900">#{ficha.numero}</span>
                                      <span className="text-gray-600 ml-2">{ficha.programa}</span>
                                    </div>
                                    <Badge variant="outline">{ficha.aprendices} aprendices</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Estadísticas del Instructor */}
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-blue-600">{instructor.fichasAsignadas.length}</div>
                              <div className="text-xs text-gray-600">Fichas</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-green-600">
                                {instructor.fichasAsignadas.reduce((sum, f) => sum + f.aprendices, 0)}
                              </div>
                              <div className="text-xs text-gray-600">Aprendices</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-purple-600">{instructor.solicitudesFormacion}</div>
                              <div className="text-xs text-gray-600">Solicitudes</div>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-amber-600">{instructor.horasFormacion}h</div>
                              <div className="text-xs text-gray-600">Formación</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Perfil
                          </Button>
                          <Button variant="outline" size="sm">
                            <Award className="h-4 w-4 mr-1" />
                            Asignar Ficha
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredInstructores.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron instructores</h3>
                    <p className="text-gray-600">
                      {searchTerm ? "Intenta con otros términos de búsqueda" : "Aún no hay instructores registrados"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <SolicitudDetalleModal
        solicitudId={selectedSolicitudId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
        userRole={user?.role}
      />
    </div>
  )
}
