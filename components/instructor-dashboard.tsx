"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  Calendar,
  BookOpen,
  Award,
  User,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Solicitud {
  id: string
  codigo: string
  programa: {
    nombre: string
    codigo: string
    duracionHoras: number
    modalidad: string
  }
  fechaInicio: string
  fechaSolicitud: string
  numeroAprendices: number
  estado: string
}

interface Estadisticas {
  totalSolicitudes: number
  aprobadas: number
  pendientes: number
  enRevision: number
  horasFormacion: number
}

const InstructorDashboard = () => {
  const { user, token } = useAuth()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalSolicitudes: 0,
    aprobadas: 0,
    pendientes: 0,
    enRevision: 0,
    horasFormacion: 0,
  })
  const [programasRecomendados, setProgramasRecomendados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && token) {
      loadDashboardData()
    }
  }, [user, token])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const solicitudesResponse = await fetch("/api/solicitudes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (solicitudesResponse.ok) {
        const solicitudesData = await solicitudesResponse.json()
        setSolicitudes(solicitudesData.solicitudes)

        // Calculate statistics from real data
        const stats = calculateStatistics(solicitudesData.solicitudes)
        setEstadisticas(stats)
      }

      // Load recommended programs
      const programasResponse = await fetch("/api/programas?limit=6", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (programasResponse.ok) {
        const programasData = await programasResponse.json()
        setProgramasRecomendados(programasData.programas.slice(0, 3))
      }
    } catch (error) {
      setError("Error al cargar los datos del dashboard")
    } finally {
      setLoading(false)
    }
  }

  const calculateStatistics = (solicitudesList: Solicitud[]): Estadisticas => {
    return {
      totalSolicitudes: solicitudesList.length,
      aprobadas: solicitudesList.filter((s) => s.estado === "APROBADA").length,
      pendientes: solicitudesList.filter((s) => s.estado === "PENDIENTE").length,
      enRevision: solicitudesList.filter((s) => s.estado === "EN_REVISION").length,
      horasFormacion: solicitudesList
        .filter((s) => s.estado === "APROBADA")
        .reduce((acc, s) => acc + s.programa.duracionHoras, 0),
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "APROBADA":
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>
      case "EN_REVISION":
        return <Badge className="bg-blue-100 text-blue-800">En Revisión</Badge>
      case "PENDIENTE":
        return <Badge className="bg-amber-100 text-amber-800">Pendiente</Badge>
      case "RECHAZADA":
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>
      case "BORRADOR":
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getProgressPercentage = () => {
    if (estadisticas.totalSolicitudes === 0) return 0
    return Math.round((estadisticas.aprobadas / Math.max(estadisticas.totalSolicitudes, 4)) * 100)
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
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Header de Bienvenida */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido, {user?.name}!</h2>
                  <p className="text-gray-600">{user?.centro?.nombre}</p>
                  <p className="text-sm text-gray-500">
                    Gestiona tus solicitudes de formación complementaria de manera eficiente
                  </p>
                  <div className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>Progreso: {getProgressPercentage()}% completado</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/nueva-solicitud">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Solicitud
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progreso de Formación */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Progreso Anual</h3>
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cursos Aprobados</span>
                    <span className="font-medium">{estadisticas.aprobadas}/4</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>
                <div className="text-sm text-gray-600">
                  <p>Meta: 4 cursos por año</p>
                  <p>Horas acumuladas: {estadisticas.horasFormacion}h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalSolicitudes}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Aprobadas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.aprobadas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes + estadisticas.enRevision}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Horas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.horasFormacion}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.totalSolicitudes > 0
                    ? Math.round(estadisticas.horasFormacion / estadisticas.totalSolicitudes)
                    : 0}
                  h
                </p>
              </div>
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Éxito</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.totalSolicitudes > 0
                    ? Math.round((estadisticas.aprobadas / estadisticas.totalSolicitudes) * 100)
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal con Tabs */}
      <Tabs defaultValue="solicitudes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="solicitudes" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Mis Solicitudes</span>
          </TabsTrigger>
          <TabsTrigger value="recomendaciones" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Programas Disponibles</span>
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solicitudes" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Mis Solicitudes de Formación</h3>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/nueva-solicitud">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Solicitud
              </Link>
            </Button>
          </div>

          {solicitudes.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes solicitudes aún</h3>
              <p className="text-gray-600 mb-4">Crea tu primera solicitud de formación complementaria para comenzar.</p>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/nueva-solicitud">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Solicitud
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {solicitudes.map((solicitud) => (
                <Card key={solicitud.id} className="border-l-4 border-l-green-400 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">{solicitud.programa.nombre}</h4>
                          {getEstadoBadge(solicitud.estado)}
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>ID: {solicitud.codigo}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{solicitud.programa.duracionHoras} horas</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{solicitud.programa.modalidad}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{solicitud.numeroAprendices} aprendices</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="text-sm text-gray-500">
                            Solicitado el {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-CO")}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => (window.location.href = `/solicitudes/${solicitud.id}`)}
                            >
                              Ver Detalles
                            </Button>
                            {(solicitud.estado === "PENDIENTE" || solicitud.estado === "BORRADOR") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => (window.location.href = `/editar-solicitud/${solicitud.id}`)}
                              >
                                Editar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recomendaciones" className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900">Programas Disponibles para Ti</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programasRecomendados.map((programa: any) => (
              <Card key={programa.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{programa.nombre}</h4>
                      <p className="text-sm text-gray-600 mt-2">{programa.descripcion}</p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{programa.duracionHoras} horas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{programa.modalidad}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Hasta {programa.cupoAprendices} aprendices</span>
                      </div>
                    </div>

                    <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Link href="/nueva-solicitud">Solicitar Programa</Link>
                    </Button>
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
                  <label className="text-sm font-medium text-gray-700">Especialidad</label>
                  <p className="text-gray-900">{user?.especialidad || "No especificada"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Formación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso de Formación</span>
                    <span>{getProgressPercentage()}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {estadisticas.aprobadas} de 4 cursos completados este año
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{estadisticas.aprobadas}</div>
                    <div className="text-sm text-gray-600">Cursos Aprobados</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{estadisticas.horasFormacion}</div>
                    <div className="text-sm text-gray-600">Horas de Formación</div>
                  </div>
                </div>

                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/mis-solicitudes">Ver Historial Completo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { InstructorDashboard }
