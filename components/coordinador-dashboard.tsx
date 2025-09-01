"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

export function CoordinadorDashboard() {
  const coordinador = {
    nombre: "Carlos Rodríguez",
    centro: "Centro de Gestión Agroempresarial del Oriente",
    email: "carlos.rodriguez@sena.edu.co",
  }

  const [searchTerm, setSearchTerm] = useState("")

  // Fichas pendientes de aprobación
  const [fichasPendientes, setFichasPendientes] = useState([
    {
      id: "FICHA-2024-001",
      numero: "2024001",
      programa: "Tecnólogo en Análisis y Desarrollo de Software",
      instructor: "María González Pérez",
      aprendices: 25,
      fechaSolicitud: "2024-01-20",
      fechaInicio: "2024-02-15",
      duracion: "24 meses",
      modalidad: "Presencial",
      estado: "pendiente",
      justificacion: "Ficha solicitada para atender la demanda de formación en desarrollo de software en la región.",
    },
    {
      id: "FICHA-2024-002",
      numero: "2024002",
      programa: "Técnico en Biotecnología",
      instructor: "Ana María Pérez López",
      aprendices: 20,
      fechaSolicitud: "2024-01-18",
      fechaInicio: "2024-03-01",
      duracion: "18 meses",
      modalidad: "Presencial",
      estado: "pendiente",
      justificacion: "Necesidad de formar técnicos especializados en biotecnología para el sector agropecuario.",
    },
  ])

  // Instructores del centro
  const [instructores, setInstructores] = useState([
    {
      id: "INST-001",
      nombres: "María",
      apellidos: "González Pérez",
      cedula: "1234567890",
      email: "maria.gonzalez@sena.edu.co",
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
      nombres: "Ana María",
      apellidos: "Pérez López",
      cedula: "0987654321",
      email: "ana.perez@sena.edu.co",
      telefono: "+57 301 234 5678",
      especialidad: "Biotecnología Agropecuaria",
      fechaIngreso: "2023-01-20",
      estado: "activo",
      fichasAsignadas: [{ numero: "2023-046", programa: "Técnico en Biotecnología", aprendices: 20 }],
      solicitudesFormacion: 1,
      horasFormacion: 80,
    },
    {
      id: "INST-003",
      nombres: "Luis Fernando",
      apellidos: "Martínez Silva",
      cedula: "1122334455",
      email: "luis.martinez@sena.edu.co",
      telefono: "+57 302 345 6789",
      especialidad: "Gestión Empresarial",
      fechaIngreso: "2022-08-10",
      estado: "activo",
      fichasAsignadas: [],
      solicitudesFormacion: 0,
      horasFormacion: 200,
    },
  ])

  const estadisticas = {
    fichasPendientes: fichasPendientes.length,
    totalInstructores: instructores.length,
    instructoresActivos: instructores.filter((i) => i.estado === "activo").length,
    totalFichasActivas: instructores.reduce((acc, i) => acc + i.fichasAsignadas.length, 0),
    totalAprendices: instructores.reduce(
      (acc, i) => acc + i.fichasAsignadas.reduce((sum, f) => sum + f.aprendices, 0),
      0,
    ),
  }

  const filteredInstructores = instructores.filter(
    (instructor) =>
      instructor.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.cedula.includes(searchTerm) ||
      instructor.especialidad.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApprobarFicha = (fichaId: string) => {
    setFichasPendientes((prev) => prev.filter((f) => f.id !== fichaId))
    console.log(`Ficha ${fichaId} aprobada`)
  }

  const handleRechazarFicha = (fichaId: string) => {
    setFichasPendientes((prev) => prev.filter((f) => f.id !== fichaId))
    console.log(`Ficha ${fichaId} rechazada`)
  }

  return (
    <div className="space-y-8">
      {/* Header de Bienvenida */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido, {coordinador.nombre}!</h2>
              <p className="text-gray-600">{coordinador.centro}</p>
              <p className="text-sm text-gray-500 mt-1">
                Gestiona las fichas de formación, instructores y aprobaciones de tu centro
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
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fichas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.fichasPendientes}</p>
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
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fichas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalFichasActivas}</p>
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
      <Tabs defaultValue="fichas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="fichas" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Aprobar Fichas</span>
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

        {/* Pestaña 1: Aprobar Fichas */}
        <TabsContent value="fichas" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span>Fichas Pendientes de Aprobación</span>
              </CardTitle>
              <CardDescription>Revisa y aprueba las fichas de formación solicitadas para tu centro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fichasPendientes.map((ficha) => (
                  <Card key={ficha.id} className="border-l-4 border-l-red-400 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">Ficha #{ficha.numero}</h4>
                            <Badge className="bg-red-100 text-red-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">{ficha.aprendices} aprendices</Badge>
                          </div>

                          <h5 className="text-md font-medium text-gray-800 mb-2">{ficha.programa}</h5>

                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>Instructor: {ficha.instructor}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Inicio: {new Date(ficha.fechaInicio).toLocaleDateString("es-CO")}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Duración: {ficha.duracion}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>Modalidad: {ficha.modalidad}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h6 className="font-medium text-gray-900 mb-2">Justificación:</h6>
                            <p className="text-sm text-gray-700">{ficha.justificacion}</p>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            onClick={() => handleApprobarFicha(ficha.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            onClick={() => handleRechazarFicha(ficha.id)}
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {fichasPendientes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Excelente trabajo!</h3>
                    <p className="text-gray-600">No hay fichas pendientes de aprobación en este momento.</p>
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
                            <h4 className="text-lg font-semibold text-gray-900">
                              {instructor.nombres} {instructor.apellidos}
                            </h4>
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
                              <span>Desde {new Date(instructor.fechaIngreso).toLocaleDateString("es-CO")}</span>
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
    </div>
  )
}
