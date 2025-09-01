"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  FileText,
  Download,
  Bell,
  Settings,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export function DashboardView() {
  const user = {
    name: "María González",
    email: "maria.gonzalez@email.com",
    id: "1234567890",
    program: "Tecnología en Desarrollo de Software",
    center: "Centro de Biotecnología Agropecuaria",
    avatar: "/placeholder.svg?height=100&width=100",
  }

  const currentCourses = [
    {
      id: 1,
      name: "Programación Web Frontend",
      instructor: "Ing. Carlos Rodríguez",
      progress: 75,
      nextClass: "2024-01-20 08:00",
      status: "En progreso",
    },
    {
      id: 2,
      name: "Base de Datos",
      instructor: "Ing. Ana Martínez",
      progress: 60,
      nextClass: "2024-01-22 10:00",
      status: "En progreso",
    },
    {
      id: 3,
      name: "Metodologías Ágiles",
      instructor: "Lic. Pedro Jiménez",
      progress: 90,
      nextClass: "2024-01-25 14:00",
      status: "Por finalizar",
    },
  ]

  const completedCourses = [
    {
      name: "Fundamentos de Programación",
      grade: 4.5,
      completedDate: "2023-12-15",
      certificate: true,
    },
    {
      name: "HTML y CSS Básico",
      grade: 4.8,
      completedDate: "2023-11-20",
      certificate: true,
    },
  ]

  const notifications = [
    {
      id: 1,
      type: "assignment",
      title: "Nueva tarea disponible",
      message: "Proyecto final de Programación Web Frontend",
      time: "Hace 2 horas",
      read: false,
    },
    {
      id: 2,
      type: "grade",
      title: "Calificación publicada",
      message: "Base de Datos - Examen parcial: 4.2/5.0",
      time: "Hace 1 día",
      read: false,
    },
    {
      id: 3,
      type: "reminder",
      title: "Recordatorio de clase",
      message: "Metodologías Ágiles mañana a las 2:00 PM",
      time: "Hace 2 días",
      read: true,
    },
  ]

  const stats = [
    {
      title: "Cursos Activos",
      value: "3",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Promedio General",
      value: "4.5",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Horas Completadas",
      value: "240",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Certificados",
      value: "2",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Panel de Estudiante</h1>
              <p className="text-gray-600 mt-1">Bienvenido de vuelta, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-green-100 text-green-600 text-xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <p className="text-sm text-gray-600 mb-4">ID: {user.id}</p>
                <Badge className="bg-green-100 text-green-600">Estudiante Activo</Badge>
              </CardContent>
            </Card>

            {/* Program Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mi Programa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.program}</p>
                  <p className="text-sm text-gray-600">{user.center}</p>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progreso general</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Horario
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Mis Notas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Certificados
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Current Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Cursos Actuales</span>
                </CardTitle>
                <CardDescription>Tus cursos en progreso y próximas clases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentCourses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                        </div>
                        <Badge
                          variant={course.status === "En progreso" ? "default" : "secondary"}
                          className={course.status === "En progreso" ? "bg-green-100 text-green-700" : ""}
                        >
                          {course.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progreso</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Próxima clase: {new Date(course.nextClass).toLocaleDateString("es-CO")} a las{" "}
                              {new Date(course.nextClass).toLocaleTimeString("es-CO", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications and Completed Courses */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-green-600" />
                    <span>Notificaciones Recientes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg ${notification.read ? "bg-gray-50" : "bg-green-50"}`}
                      >
                        <div className="flex-shrink-0">
                          {notification.type === "assignment" && <FileText className="h-5 w-5 text-blue-600" />}
                          {notification.type === "grade" && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {notification.type === "reminder" && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && <div className="w-2 h-2 bg-green-600 rounded-full"></div>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Completed Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span>Cursos Completados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedCourses.map((course, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-green-600">{course.grade}/5.0</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Completado: {new Date(course.completedDate).toLocaleDateString("es-CO")}</span>
                          {course.certificate && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Certificado
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
