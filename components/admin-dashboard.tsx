"use client"

import { useState } from "react"
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
  Award,
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
} from "lucide-react"

export function AdminDashboard() {
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([
    {
      id: "SOL-2024-048",
      instructor: "Ana María Pérez",
      curso: "Excel Avanzado para Análisis de Datos",
      centro: "Centro de Gestión Agroempresarial",
      fechaSolicitud: "2024-01-20",
      fechaInicio: "2024-02-15",
      duracionHoras: 40,
      estado: "pendiente",
      prioridad: "alta",
    },
    {
      id: "SOL-2024-049",
      instructor: "Carlos Rodríguez",
      curso: "Python para Biotecnología",
      centro: "Centro de Biotecnología",
      fechaSolicitud: "2024-01-19",
      fechaInicio: "2024-03-01",
      duracionHoras: 60,
      estado: "pendiente",
      prioridad: "media",
    },
  ])

  const [solicitudesAcceso, setSolicitudesAcceso] = useState([
    {
      id: "REG-2024-001",
      nombre: "Laura Martínez",
      email: "laura.martinez@sena.edu.co",
      centro: "Centro de Comercio y Servicios",
      cargo: "instructor",
      fechaSolicitud: "2024-01-22",
      estado: "pendiente",
      justificacion: "Necesito acceso para gestionar solicitudes de formación en el área de marketing digital.",
    },
    {
      id: "REG-2024-002",
      nombre: "Diego Hernández",
      email: "diego.hernandez@sena.edu.co",
      centro: "Centro de Tecnologías",
      cargo: "coordinador",
      fechaSolicitud: "2024-01-21",
      estado: "pendiente",
      justificacion: "Coordinador del área de desarrollo de software, requiero acceso para supervisar solicitudes.",
    },
  ])

  const [usuarios, setUsuarios] = useState([
    {
      id: "USR-001",
      nombre: "María González",
      email: "maria.gonzalez@sena.edu.co",
      centro: "Centro de Gestión Agroempresarial",
      rol: "instructor",
      estado: "activo",
      ultimoAcceso: "2024-01-22",
      solicitudesCreadas: 5,
    },
    {
      id: "USR-002",
      nombre: "Carlos Rodríguez",
      email: "carlos.rodriguez@sena.edu.co",
      centro: "Centro de Gestión Agroempresarial",
      rol: "coordinador",
      estado: "activo",
      ultimoAcceso: "2024-01-22",
      solicitudesCreadas: 0,
    },
    {
      id: "USR-003",
      nombre: "Ana Pérez",
      email: "ana.perez@sena.edu.co",
      centro: "Centro de Biotecnología",
      rol: "instructor",
      estado: "inactivo",
      ultimoAcceso: "2024-01-15",
      solicitudesCreadas: 2,
    },
  ])

  const estadisticasGenerales = {
    totalUsuarios: usuarios.length,
    usuariosActivos: usuarios.filter((u) => u.estado === "activo").length,
    solicitudesPendientes: solicitudesPendientes.length,
    solicitudesAccesoPendientes: solicitudesAcceso.length,
    centrosActivos: 8,
    cursosOfertados: 45,
    horasTotales: 12450,
    tasaAprobacion: 87,
  }

  const handleApproveAccess = (id: string) => {
    const solicitud = solicitudesAcceso.find((s) => s.id === id)
    if (solicitud) {
      // Crear nuevo usuario
      const nuevoUsuario = {
        id: `USR-${String(usuarios.length + 1).padStart(3, "0")}`,
        nombre: solicitud.nombre,
        email: solicitud.email,
        centro: solicitud.centro,
        rol: solicitud.cargo,
        estado: "activo" as const,
        ultimoAcceso: new Date().toISOString().split("T")[0],
        solicitudesCreadas: 0,
      }
      setUsuarios((prev) => [...prev, nuevoUsuario])
      setSolicitudesAcceso((prev) => prev.filter((s) => s.id !== id))
      console.log(`Acceso aprobado para ${solicitud.nombre}`)
    }
  }

  const handleRejectAccess = (id: string) => {
    setSolicitudesAcceso((prev) => prev.filter((s) => s.id !== id))
    console.log(`Acceso rechazado para solicitud ${id}`)
  }

  const handleToggleUserStatus = (id: string) => {
    setUsuarios((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, estado: user.estado === "activo" ? "inactivo" : "activo" } : user,
      ),
    )
  }

  const handleApprove = (id: string) => {
    setSolicitudesPendientes((prev) => prev.filter((s) => s.id !== id))
    console.log(`Solicitud ${id} aprobada por administrador`)
  }

  const handleReject = (id: string) => {
    setSolicitudesPendientes((prev) => prev.filter((s) => s.id !== id))
    console.log(`Solicitud ${id} rechazada por administrador`)
  }

  return (
    <div className="space-y-8">
      {/* Estadísticas Principales */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticasGenerales.totalUsuarios}</p>
                <p className="text-sm text-green-600">{estadisticasGenerales.usuariosActivos} activos</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solicitudes de Acceso</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticasGenerales.solicitudesAccesoPendientes}</p>
                <p className="text-sm text-purple-600">Pendientes de revisión</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solicitudes Formación</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticasGenerales.solicitudesPendientes}</p>
                <p className="text-sm text-amber-600">Requieren atención</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Aprobación</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticasGenerales.tasaAprobacion}%</p>
                <p className="text-sm text-green-600">+5% vs mes anterior</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para organizar el contenido */}
      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usuarios">Gestión de Usuarios</TabsTrigger>
          <TabsTrigger value="solicitudes">Solicitudes Formación</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Gestión de Usuarios del Sistema</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
              </CardTitle>
              <CardDescription>Administra los usuarios activos del sistema y sus permisos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <Card key={usuario.id} className="border-l-4 border-l-blue-400 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{usuario.nombre}</h4>
                            <Badge
                              className={
                                usuario.rol === "admin"
                                  ? "bg-red-100 text-red-800"
                                  : usuario.rol === "coordinador"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {usuario.rol === "admin"
                                ? "⚙️ Administrador"
                                : usuario.rol === "coordinador"
                                  ? "👨‍💼 Coordinador"
                                  : "👨‍🏫 Instructor"}
                            </Badge>
                            <Badge
                              className={
                                usuario.estado === "activo"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {usuario.estado === "activo" ? "✅ Activo" : "⏸️ Inactivo"}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Email:</span> {usuario.email}
                            </div>
                            <div>
                              <span className="font-medium">Centro:</span> {usuario.centro}
                            </div>
                            <div>
                              <span className="font-medium">Último acceso:</span>{" "}
                              {new Date(usuario.ultimoAcceso).toLocaleDateString("es-CO")}
                            </div>
                            <div>
                              <span className="font-medium">Solicitudes:</span> {usuario.solicitudesCreadas}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Perfil
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleUserStatus(usuario.id)}
                            className={
                              usuario.estado === "activo"
                                ? "border-red-600 text-red-600 hover:bg-red-50"
                                : "border-green-600 text-green-600 hover:bg-green-50"
                            }
                          >
                            {usuario.estado === "activo" ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-purple-600" />
                  <span>Solicitudes de Acceso al Sistema</span>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {solicitudesAcceso.length} pendientes
                </Badge>
              </CardTitle>
              <CardDescription>
                Revisa y aprueba las solicitudes de acceso de nuevos instructores y coordinadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {solicitudesAcceso.map((solicitud) => (
                  <Card key={solicitud.id} className="border-l-4 border-l-purple-400 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{solicitud.nombre}</h4>
                              <Badge
                                className={
                                  solicitud.cargo === "coordinador"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }
                              >
                                {solicitud.cargo === "coordinador" ? "👨‍💼 Coordinador" : "👨‍🏫 Instructor"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-1">
                              {solicitud.email} • {solicitud.centro}
                            </p>
                            <p className="text-sm text-gray-500">ID: {solicitud.id}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Justificación:</h5>
                          <p className="text-sm text-gray-700">{solicitud.justificacion}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MessageSquare className="h-4 w-4" />
                            <span>Solicitado el {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-CO")}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectAccess(solicitud.id)}
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApproveAccess(solicitud.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprobar Acceso
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {solicitudesAcceso.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCheck className="h-12 w-12 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay solicitudes pendientes</h3>
                    <p className="text-gray-600">Todas las solicitudes de acceso han sido procesadas.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solicitudes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Solicitudes de Formación Pendientes</span>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {solicitudesPendientes.length} pendientes
                </Badge>
              </CardTitle>
              <CardDescription>
                Solicitudes de formación complementaria que requieren aprobación administrativa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {solicitudesPendientes.map((solicitud) => (
                  <Card key={solicitud.id} className="border-l-4 border-l-amber-400 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{solicitud.curso}</h4>
                              <p className="text-sm text-gray-600">
                                {solicitud.instructor} • {solicitud.centro}
                              </p>
                            </div>
                            <Badge
                              className={
                                solicitud.prioridad === "alta"
                                  ? "bg-red-100 text-red-800"
                                  : solicitud.prioridad === "media"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {solicitud.prioridad === "alta"
                                ? "🔴 Alta Prioridad"
                                : solicitud.prioridad === "media"
                                  ? "🟡 Media Prioridad"
                                  : "🟢 Baja Prioridad"}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">ID:</span> {solicitud.id}
                            </div>
                            <div>
                              <span className="font-medium">Duración:</span> {solicitud.duracionHoras}h
                            </div>
                            <div>
                              <span className="font-medium">Inicio:</span>{" "}
                              {new Date(solicitud.fechaInicio).toLocaleDateString("es-CO")}
                            </div>
                            <div>
                              <span className="font-medium">Solicitado:</span>{" "}
                              {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-CO")}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span>
                            Pendiente hace{" "}
                            {Math.floor(
                              (Date.now() - new Date(solicitud.fechaSolicitud).getTime()) / (1000 * 60 * 60 * 24),
                            )}{" "}
                            días
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
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

                {solicitudesPendientes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Todo al día!</h3>
                    <p className="text-gray-600">No hay solicitudes pendientes de aprobación.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Rendimiento por Centro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span>Rendimiento por Centro</span>
                </CardTitle>
                <CardDescription>Usuarios activos y solicitudes por centro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { nombre: "Centro de Gestión Agroempresarial", usuarios: 12, solicitudes: 45, porcentaje: 93 },
                    { nombre: "Centro de Biotecnología", usuarios: 8, solicitudes: 38, porcentaje: 82 },
                    { nombre: "Centro de Comercio y Servicios", usuarios: 6, solicitudes: 29, porcentaje: 90 },
                    { nombre: "Centro de Tecnologías", usuarios: 4, solicitudes: 22, porcentaje: 82 },
                  ].map((centro, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-900">{centro.nombre}</h4>
                        <span className="text-sm font-semibold text-gray-900">{centro.usuarios} usuarios</span>
                      </div>
                      <Progress value={centro.porcentaje} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{centro.solicitudes} solicitudes</span>
                        <span>{centro.porcentaje}% aprobación</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actividad Reciente */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente del Sistema</CardTitle>
                <CardDescription>Últimas acciones administrativas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      accion: "Usuario creado",
                      detalle: "Laura Martínez - Instructor",
                      usuario: "Admin",
                      tiempo: "Hace 1 hora",
                      tipo: "usuario",
                    },
                    {
                      accion: "Solicitud aprobada",
                      detalle: "SOL-2024-047 - Excel Avanzado",
                      usuario: "Admin",
                      tiempo: "Hace 2 horas",
                      tipo: "solicitud",
                    },
                    {
                      accion: "Acceso rechazado",
                      detalle: "REG-2024-003 - Documentación incompleta",
                      usuario: "Admin",
                      tiempo: "Hace 3 horas",
                      tipo: "acceso",
                    },
                    {
                      accion: "Usuario desactivado",
                      detalle: "Pedro García - Inactividad prolongada",
                      usuario: "Admin",
                      tiempo: "Hace 1 día",
                      tipo: "usuario",
                    },
                  ].map((actividad, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          actividad.tipo === "usuario"
                            ? "bg-blue-500"
                            : actividad.tipo === "solicitud"
                              ? "bg-green-500"
                              : "bg-purple-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{actividad.accion}</p>
                        <p className="text-sm text-gray-600">{actividad.detalle}</p>
                        <p className="text-xs text-gray-500">
                          {actividad.usuario} • {actividad.tiempo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Estado del Sistema</span>
              </CardTitle>
              <CardDescription>Monitoreo en tiempo real de los servicios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Servicios Principales</h4>
                  {[
                    { servicio: "Base de Datos", estado: "operativo", uptime: "99.9%" },
                    { servicio: "API Principal", estado: "operativo", uptime: "99.8%" },
                    { servicio: "Sistema de Archivos", estado: "operativo", uptime: "100%" },
                    { servicio: "Notificaciones", estado: "operativo", uptime: "99.5%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">{item.servicio}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-green-600 font-medium">Operativo</span>
                        <p className="text-xs text-gray-500">{item.uptime} uptime</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Métricas de Rendimiento</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uso de CPU</span>
                        <span>23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uso de Memoria</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Almacenamiento</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
