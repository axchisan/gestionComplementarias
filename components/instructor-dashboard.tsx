"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Clock, CheckCircle, Calendar, BookOpen, Award, User, Bell, TrendingUp } from "lucide-react"

export function InstructorDashboard() {
  const instructor = {
    nombre: "María González",
    centro: "Centro de Gestión Agroempresarial del Oriente",
    email: "maria.gonzalez@sena.edu.co",
    telefono: "+57 300 123 4567",
  }

  const misSolicitudes = [
    {
      id: "SOL-2024-045",
      curso: "Excel Avanzado para Análisis de Datos",
      fechaSolicitud: "2024-01-20",
      fechaInicio: "2024-02-15",
      duracionHoras: 40,
      estado: "aprobada",
      modalidad: "Presencial",
    },
    {
      id: "SOL-2024-046",
      curso: "Fundamentos de Programación Python",
      fechaSolicitud: "2024-01-19",
      fechaInicio: "2024-03-01",
      duracionHoras: 60,
      estado: "en_revision",
      modalidad: "Virtual",
    },
    {
      id: "SOL-2024-047",
      curso: "Metodologías Ágiles - Scrum",
      fechaSolicitud: "2024-01-18",
      fechaInicio: "2024-02-20",
      duracionHoras: 30,
      estado: "pendiente",
      modalidad: "Mixta",
    },
  ]

  const estadisticas = {
    totalSolicitudes: misSolicitudes.length,
    aprobadas: misSolicitudes.filter((s) => s.estado === "aprobada").length,
    pendientes: misSolicitudes.filter((s) => s.estado === "pendiente").length,
    enRevision: misSolicitudes.filter((s) => s.estado === "en_revision").length,
    horasFormacion: misSolicitudes.reduce((acc, s) => acc + s.duracionHoras, 0),
  }

  const notificaciones = [
    {
      tipo: "success",
      titulo: "Solicitud Aprobada",
      mensaje: "Tu solicitud SOL-2024-045 ha sido aprobada",
      tiempo: "Hace 2 horas",
    },
    {
      tipo: "info",
      titulo: "Recordatorio",
      mensaje: "El curso de Excel Avanzado inicia el 15 de febrero",
      tiempo: "Hace 1 día",
    },
    {
      tipo: "warning",
      titulo: "Documentación Pendiente",
      mensaje: "Completa la documentación para SOL-2024-047",
      tiempo: "Hace 2 días",
    },
  ]

  const cursosRecomendados = [
    {
      nombre: "Power BI para Análisis de Datos",
      duracion: "45 horas",
      modalidad: "Virtual",
      descripcion: "Aprende a crear dashboards interactivos y análisis avanzados",
    },
    {
      nombre: "Gestión de Proyectos con MS Project",
      duracion: "35 horas",
      modalidad: "Presencial",
      descripcion: "Domina las herramientas de planificación y seguimiento de proyectos",
    },
    {
      nombre: "Inteligencia Artificial Aplicada",
      duracion: "50 horas",
      modalidad: "Mixta",
      descripcion: "Introducción práctica a IA y Machine Learning",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header de Bienvenida Mejorado */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido, {instructor.nombre}!</h2>
                  <p className="text-gray-600">{instructor.centro}</p>
                  <p className="text-sm text-gray-500">
                    Gestiona tus solicitudes de formación complementaria de manera eficiente
                  </p>
                  <div className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>Progreso: 75% completado</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Solicitud
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
                    <span>Cursos Completados</span>
                    <span className="font-medium">3/4</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="text-sm text-gray-600">
                  <p>🎯 Meta: 4 cursos por año</p>
                  <p>⏱️ Tiempo restante: 3 meses</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Rápidas Reorganizadas */}
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
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ranking</p>
                <p className="text-2xl font-bold text-gray-900">#12</p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal con Tabs Mejorado */}
      <Tabs defaultValue="solicitudes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="solicitudes" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Mis Solicitudes</span>
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="recomendaciones" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Recomendados</span>
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solicitudes" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Mis Solicitudes de Formación</h3>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          </div>

          <div className="grid gap-4">
            {misSolicitudes.map((solicitud) => (
              <Card key={solicitud.id} className="border-l-4 border-l-green-400 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">{solicitud.curso}</h4>
                        <Badge
                          className={
                            solicitud.estado === "aprobada"
                              ? "bg-green-100 text-green-800"
                              : solicitud.estado === "en_revision"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }
                        >
                          {solicitud.estado === "aprobada"
                            ? "✅ Aprobada"
                            : solicitud.estado === "en_revision"
                              ? "🔍 En Revisión"
                              : "⏳ Pendiente"}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>ID: {solicitud.id}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{solicitud.duracionHoras} horas</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{solicitud.modalidad}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Inicio: {new Date(solicitud.fechaInicio).toLocaleDateString("es-CO")}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-500">
                          Solicitado el {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-CO")}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                          {solicitud.estado === "pendiente" && (
                            <Button variant="outline" size="sm">
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
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900">Notificaciones Recientes</h3>
          <div className="space-y-4">
            {notificaciones.map((notificacion, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  notificacion.tipo === "success"
                    ? "border-l-green-400 bg-green-50"
                    : notificacion.tipo === "info"
                      ? "border-l-blue-400 bg-blue-50"
                      : "border-l-amber-400 bg-amber-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{notificacion.titulo}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notificacion.mensaje}</p>
                    </div>
                    <span className="text-xs text-gray-500">{notificacion.tiempo}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recomendaciones" className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900">Cursos Recomendados para Ti</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosRecomendados.map((curso, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{curso.nombre}</h4>
                      <p className="text-sm text-gray-600 mt-2">{curso.descripcion}</p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{curso.duracion}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{curso.modalidad}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Solicitar Curso</Button>
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
                    <p className="text-gray-900">{instructor.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="text-gray-900">{instructor.telefono}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Centro de Formación</label>
                  <p className="text-gray-900">{instructor.centro}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <p className="text-gray-900">{instructor.email}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Editar Información
                </Button>
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
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">3 de 4 cursos completados este año</p>
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

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Ver Historial Completo</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
