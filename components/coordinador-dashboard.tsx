"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  BookOpen,
  User,
  Building,
  Target,
  Activity,
  BarChart3,
  AlertTriangle,
  GraduationCap,
  Plus,
  Eye,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface EstadisticasCoordinador {
  // Estadísticas principales
  totalSolicitudes: number
  solicitudesPendientes: number
  solicitudesAprobadas: number
  solicitudesRechazadas: number

  // Métricas de rendimiento
  tasaAprobacion: number
  tiempoPromedioRespuesta: number
  solicitudesUrgentes: number

  // Gestión de instructores
  totalInstructores: number
  instructoresActivos: number
  instructoresConSolicitudes: number

  // Formación y aprendices
  totalAprendices: number
  horasFormacionAprobadas: number
  programasActivos: number

  // Metas mensuales
  metaMensualSolicitudes: number
  solicitudesProcesadasMes: number
  metaTiempoRespuesta: number
}

interface SolicitudReciente {
  id: string
  codigo: string
  instructor: string
  programa: string
  estado: string
  fechaSolicitud: string
  prioridad: "ALTA" | "MEDIA" | "BAJA"
}

interface InstructorResumen {
  id: string
  name: string
  email: string
  solicitudesActivas: number
  horasFormacion: number
  ultimaActividad: string
}

export function CoordinadorDashboard() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [estadisticas, setEstadisticas] = useState<EstadisticasCoordinador>({
    totalSolicitudes: 0,
    solicitudesPendientes: 0,
    solicitudesAprobadas: 0,
    solicitudesRechazadas: 0,
    tasaAprobacion: 0,
    tiempoPromedioRespuesta: 0,
    solicitudesUrgentes: 0,
    totalInstructores: 0,
    instructoresActivos: 0,
    instructoresConSolicitudes: 0,
    totalAprendices: 0,
    horasFormacionAprobadas: 0,
    programasActivos: 0,
    metaMensualSolicitudes: 50,
    solicitudesProcesadasMes: 0,
    metaTiempoRespuesta: 3,
  })

  const [solicitudesRecientes, setSolicitudesRecientes] = useState<SolicitudReciente[]>([])
  const [instructoresResumen, setInstructoresResumen] = useState<InstructorResumen[]>([])

  useEffect(() => {
    if (user && token) {
      loadDashboardData()
    }
  }, [user, token])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadEstadisticas(), loadSolicitudesRecientes(), loadInstructoresResumen()])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadEstadisticas = async () => {
    try {
      // Load solicitudes statistics
      const solicitudesResponse = await fetch("/api/solicitudes?limit=1000", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (solicitudesResponse.ok) {
        const data = await solicitudesResponse.json()
        const solicitudes = data.solicitudes || []

        // Calculate statistics
        const pendientes = solicitudes.filter((s: any) => s.estado === "PENDIENTE").length
        const aprobadas = solicitudes.filter((s: any) => s.estado === "APROBADA").length
        const rechazadas = solicitudes.filter((s: any) => s.estado === "RECHAZADA").length

        // Calculate this month's processed requests
        const thisMonth = new Date()
        thisMonth.setDate(1)
        const procesadasMes = solicitudes.filter(
          (s: any) => (s.estado === "APROBADA" || s.estado === "RECHAZADA") && new Date(s.updatedAt) >= thisMonth,
        ).length

        // Calculate urgent requests (older than 7 days)
        const urgentes = solicitudes.filter((s: any) => {
          if (s.estado !== "PENDIENTE") return false
          const daysSince = Math.floor((Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          return daysSince > 7
        }).length

        // Calculate average response time
        const processedRequests = solicitudes.filter((s: any) => s.estado === "APROBADA" || s.estado === "RECHAZADA")
        const avgResponseTime =
          processedRequests.length > 0
            ? processedRequests.reduce((sum: number, s: any) => {
                const responseTime = Math.floor(
                  (new Date(s.updatedAt).getTime() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24),
                )
                return sum + responseTime
              }, 0) / processedRequests.length
            : 0

        const tasaAprobacion = solicitudes.length > 0 ? (aprobadas / solicitudes.length) * 100 : 0

        setEstadisticas((prev) => ({
          ...prev,
          totalSolicitudes: solicitudes.length,
          solicitudesPendientes: pendientes,
          solicitudesAprobadas: aprobadas,
          solicitudesRechazadas: rechazadas,
          tasaAprobacion: Math.round(tasaAprobacion),
          tiempoPromedioRespuesta: Math.round(avgResponseTime),
          solicitudesUrgentes: urgentes,
          solicitudesProcesadasMes: procesadasMes,
          horasFormacionAprobadas: solicitudes
            .filter((s: any) => s.estado === "APROBADA")
            .reduce((sum: number, s: any) => sum + (s.programa?.duracionHoras || 0), 0),
          totalAprendices: solicitudes
            .filter((s: any) => s.estado === "APROBADA")
            .reduce((sum: number, s: any) => sum + (s.numeroAprendicesInscribir || 0), 0),
        }))
      }

      // Load instructors statistics
      const instructoresResponse = await fetch("/api/instructores", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (instructoresResponse.ok) {
        const data = await instructoresResponse.json()
        const instructores = data.instructores || []

        setEstadisticas((prev) => ({
          ...prev,
          totalInstructores: instructores.length,
          instructoresActivos: instructores.filter((i: any) => i.isActive).length,
          instructoresConSolicitudes: instructores.filter((i: any) => i.solicitudesFormacion > 0).length,
        }))
      }
    } catch (error) {
      console.error("Error loading statistics:", error)
    }
  }

  const loadSolicitudesRecientes = async () => {
    try {
      const response = await fetch("/api/solicitudes?limit=5&orderBy=createdAt&order=desc", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        const solicitudes = data.solicitudes || []

        const recientes = solicitudes.map((s: any) => ({
          id: s.id,
          codigo: s.codigo,
          instructor: s.instructor?.name || "N/A",
          programa: s.programa?.nombre || "N/A",
          estado: s.estado,
          fechaSolicitud: s.createdAt,
          prioridad: calcularPrioridad(s.createdAt, s.estado),
        }))

        setSolicitudesRecientes(recientes)
      }
    } catch (error) {
      console.error("Error loading recent requests:", error)
    }
  }

  const loadInstructoresResumen = async () => {
    try {
      const response = await fetch("/api/instructores?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        const instructores = data.instructores || []

        const resumen = instructores.map((i: any) => ({
          id: i.id,
          name: i.name,
          email: i.email,
          solicitudesActivas: i.solicitudesFormacion || 0,
          horasFormacion: i.horasFormacion || 0,
          ultimaActividad: i.updatedAt,
        }))

        setInstructoresResumen(resumen)
      }
    } catch (error) {
      console.error("Error loading instructors summary:", error)
    }
  }

  const calcularPrioridad = (fechaCreacion: string, estado: string): "ALTA" | "MEDIA" | "BAJA" => {
    if (estado !== "PENDIENTE") return "BAJA"

    const diasDesdeCreacion = Math.floor((Date.now() - new Date(fechaCreacion).getTime()) / (1000 * 60 * 60 * 24))

    if (diasDesdeCreacion > 7) return "ALTA"
    if (diasDesdeCreacion > 3) return "MEDIA"
    return "BAJA"
  }

  const getProgressPercentage = () => {
    if (estadisticas.metaMensualSolicitudes === 0) return 0
    return Math.min((estadisticas.solicitudesProcesadasMes / estadisticas.metaMensualSolicitudes) * 100, 100)
  }

  const getStatusBadge = (estado: string, prioridad?: string) => {
    const priorityIcon = prioridad === "ALTA" ? <AlertTriangle className="h-3 w-3 mr-1" /> : null

    switch (estado) {
      case "PENDIENTE":
        return (
          <Badge className={`${prioridad === "ALTA" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
            {priorityIcon || <Clock className="h-3 w-3 mr-1" />}
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
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header de Bienvenida */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido, {user?.name}!</h2>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-600" />
                    <p className="text-gray-600">{user?.centro?.nombre}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Panel ejecutivo para la gestión integral de formación complementaria
                  </p>
                  <div className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>Meta mensual: {getProgressPercentage().toFixed(0)}% completada</span>
                    </div>
                    {estadisticas.solicitudesUrgentes > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{estadisticas.solicitudesUrgentes} solicitudes urgentes</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/solicitudes-pendientes">
                      <Eye className="h-4 w-4 mr-2" />
                      Gestionar Solicitudes
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/crear-usuario">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Instructor
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progreso Mensual */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Meta Mensual</h3>
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Solicitudes Procesadas</span>
                    <span className="font-medium">
                      {estadisticas.solicitudesProcesadasMes}/{estadisticas.metaMensualSolicitudes}
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
                <div className="text-sm text-gray-600">
                  <p>Tiempo promedio: {estadisticas.tiempoPromedioRespuesta}d</p>
                  <p>Tasa de aprobación: {estadisticas.tasaAprobacion}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.solicitudesPendientes}</p>
                {estadisticas.solicitudesUrgentes > 0 && (
                  <p className="text-xs text-red-600">{estadisticas.solicitudesUrgentes} urgentes</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Aprobadas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.solicitudesAprobadas}</p>
                <p className="text-xs text-green-600">Tasa: {estadisticas.tasaAprobacion}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalSolicitudes}</p>
                <p className="text-xs text-gray-600">Solicitudes</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Instructores</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalInstructores}</p>
                <p className="text-xs text-purple-600">{estadisticas.instructoresActivos} activos</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Aprendices</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalAprendices}</p>
                <p className="text-xs text-amber-600">Matriculados</p>
              </div>
              <GraduationCap className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Horas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.horasFormacionAprobadas}</p>
                <p className="text-xs text-indigo-600">Formación</p>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal con Tabs */}
      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="resumen" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Resumen Ejecutivo</span>
          </TabsTrigger>
          <TabsTrigger value="solicitudes" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Solicitudes Recientes</span>
          </TabsTrigger>
          <TabsTrigger value="instructores" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Mis Instructores</span>
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Métricas de Rendimiento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Métricas de Rendimiento</span>
                </CardTitle>
                <CardDescription>Indicadores clave de tu gestión como coordinador</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tasa de Aprobación</span>
                    <span className="font-medium">{estadisticas.tasaAprobacion}%</span>
                  </div>
                  <Progress value={estadisticas.tasaAprobacion} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">Meta: 85%</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tiempo de Respuesta</span>
                    <span className="font-medium">{estadisticas.tiempoPromedioRespuesta} días</span>
                  </div>
                  <Progress
                    value={Math.max(
                      0,
                      100 - (estadisticas.tiempoPromedioRespuesta / estadisticas.metaTiempoRespuesta) * 100,
                    )}
                    className="h-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Meta: ≤ {estadisticas.metaTiempoRespuesta} días</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Instructores Activos</span>
                    <span className="font-medium">
                      {estadisticas.instructoresActivos}/{estadisticas.totalInstructores}
                    </span>
                  </div>
                  <Progress
                    value={
                      estadisticas.totalInstructores > 0
                        ? (estadisticas.instructoresActivos / estadisticas.totalInstructores) * 100
                        : 0
                    }
                    className="h-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Participación en formación</p>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Herramientas de gestión más utilizadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/solicitudes-pendientes">
                    <Eye className="h-4 w-4 mr-2" />
                    Revisar Solicitudes Pendientes ({estadisticas.solicitudesPendientes})
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/crear-usuario">
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Nuevo Instructor
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/reportes">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generar Reportes
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/cursos">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Gestionar Programas
                  </Link>
                </Button>

                {estadisticas.solicitudesUrgentes > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Atención Requerida</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      {estadisticas.solicitudesUrgentes} solicitudes llevan más de 7 días pendientes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="solicitudes" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Solicitudes Recientes</h3>
            <Button asChild variant="outline">
              <Link href="/solicitudes-pendientes">Ver Todas</Link>
            </Button>
          </div>

          {solicitudesRecientes.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes recientes</h3>
              <p className="text-gray-600">Las nuevas solicitudes aparecerán aquí.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {solicitudesRecientes.map((solicitud) => (
                <Card key={solicitud.id} className="border-l-4 border-l-green-400 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">{solicitud.codigo}</h4>
                          {getStatusBadge(solicitud.estado, solicitud.prioridad)}
                        </div>

                        <p className="text-gray-600">{solicitud.programa}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Instructor: {solicitud.instructor}</span>
                          <span>•</span>
                          <span>{new Date(solicitud.fechaSolicitud).toLocaleDateString("es-CO")}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/solicitudes/${solicitud.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="instructores" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Resumen de Instructores</h3>
            <Button asChild variant="outline">
              <Link href="/crear-usuario">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Instructor
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructoresResumen.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{instructor.name}</h4>
                      <p className="text-sm text-gray-600">{instructor.email}</p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Solicitudes activas:</span>
                        <Badge variant="outline">{instructor.solicitudesActivas}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Horas de formación:</span>
                        <span className="font-medium">{instructor.horasFormacion}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Última actividad:</span>
                        <span>{new Date(instructor.ultimaActividad).toLocaleDateString("es-CO")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="perfil" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                    <p className="text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cédula</label>
                    <p className="text-gray-900">{user?.cedula}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Centro de Formación</label>
                  <p className="text-gray-900">{user?.centro?.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Rol</label>
                  <Badge className="bg-blue-100 text-blue-800">Coordinador</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Especialidad</label>
                  <p className="text-gray-900">{user?.especialidad || "No especificada"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Gestión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso Meta Mensual</span>
                    <span>{getProgressPercentage().toFixed(0)}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {estadisticas.solicitudesProcesadasMes} de {estadisticas.metaMensualSolicitudes} solicitudes
                    procesadas
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{estadisticas.solicitudesAprobadas}</div>
                    <div className="text-sm text-gray-600">Aprobadas</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{estadisticas.totalInstructores}</div>
                    <div className="text-sm text-gray-600">Instructores</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{estadisticas.horasFormacionAprobadas}</div>
                    <div className="text-sm text-gray-600">Horas Formación</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{estadisticas.tiempoPromedioRespuesta}d</div>
                    <div className="text-sm text-gray-600">Tiempo Respuesta</div>
                  </div>
                </div>

                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/reportes">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Reportes Detallados
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
