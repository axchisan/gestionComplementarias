"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Edit, FileText, Calendar, Clock, User, Filter, FileSpreadsheet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Solicitud {
  id: string
  numeroFicha: string
  nombreCurso: string
  instructor: string
  fechaSolicitud: string
  fechaInicio: string
  duracionHoras: number
  modalidad: string
  estado: "borrador" | "pendiente" | "en_revision" | "aprobada" | "rechazada"
  tipoFormacion: string
  version: string
  numeroAprendices?: number
}

const estadoColors = {
  borrador: "bg-gray-100 text-gray-800",
  pendiente: "bg-yellow-100 text-yellow-800",
  en_revision: "bg-blue-100 text-blue-800",
  aprobada: "bg-green-100 text-green-800",
  rechazada: "bg-red-100 text-red-800",
}

const estadoLabels = {
  borrador: "Borrador",
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
}

export function HistorialSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstado, setSelectedEstado] = useState("todas")
  const [selectedTipo, setSelectedTipo] = useState("todos")
  const [selectedYear, setSelectedYear] = useState("todos")

  useEffect(() => {
    // Cargar solicitudes del localStorage
    const solicitudesGuardadas = JSON.parse(localStorage.getItem("sena_solicitudes") || "[]")
    setSolicitudes(solicitudesGuardadas)
  }, [])

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const matchesSearch =
      solicitud.nombreCurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.numeroFicha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = selectedEstado === "todas" || solicitud.estado === selectedEstado
    const matchesTipo = selectedTipo === "todos" || solicitud.tipoFormacion.toLowerCase() === selectedTipo

    const year = new Date(solicitud.fechaSolicitud).getFullYear().toString()
    const matchesYear = selectedYear === "todos" || year === selectedYear

    return matchesSearch && matchesEstado && matchesTipo && matchesYear
  })

  const handleExportPDF = (solicitud: Solicitud) => {
    console.log("Exportar PDF:", solicitud.id)
    // Aquí iría la lógica para generar PDF
  }

  const handleExportExcel = (solicitud: Solicitud) => {
    console.log("Exportar Excel:", solicitud.id)
    // Aquí iría la lógica para generar Excel
  }

  const handleExportAll = (formato: "pdf" | "excel") => {
    console.log(`Exportar todas las solicitudes en formato ${formato}`)
    // Aquí iría la lógica para exportar todas las solicitudes
  }

  const getEstadisticas = () => {
    return {
      total: solicitudes.length,
      borradores: solicitudes.filter((s) => s.estado === "borrador").length,
      pendientes: solicitudes.filter((s) => s.estado === "pendiente").length,
      aprobadas: solicitudes.filter((s) => s.estado === "aprobada").length,
      rechazadas: solicitudes.filter((s) => s.estado === "rechazada").length,
    }
  }

  const stats = getEstadisticas()

  return (
    <div className="space-y-6">
      {/* Estadísticas Rápidas */}
      <div className="grid md:grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, color: "bg-gray-100 text-gray-800" },
          { label: "Borradores", value: stats.borradores, color: "bg-gray-100 text-gray-800" },
          { label: "Pendientes", value: stats.pendientes, color: "bg-yellow-100 text-yellow-800" },
          { label: "Aprobadas", value: stats.aprobadas, color: "bg-green-100 text-green-800" },
          { label: "Rechazadas", value: stats.rechazadas, color: "bg-red-100 text-red-800" },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <Badge className={stat.color}>{stat.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros y Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Historial de Solicitudes</span>
          </CardTitle>
          <CardDescription>Gestione y consulte todas sus solicitudes de formación complementaria</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lista" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lista">Lista de Solicitudes</TabsTrigger>
              <TabsTrigger value="exportar">Exportar Datos</TabsTrigger>
            </TabsList>

            <TabsContent value="lista" className="space-y-4">
              {/* Filtros */}
              <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar solicitudes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los estados</SelectItem>
                    <SelectItem value="borrador">Borradores</SelectItem>
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                    <SelectItem value="en_revision">En Revisión</SelectItem>
                    <SelectItem value="aprobada">Aprobadas</SelectItem>
                    <SelectItem value="rechazada">Rechazadas</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="complementaria">Complementaria</SelectItem>
                    <SelectItem value="transversal">Transversal</SelectItem>
                    <SelectItem value="especifica">Específica</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los años</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Limpiar Filtros</span>
                </Button>
              </div>

              {/* Lista de Solicitudes */}
              <div className="space-y-4">
                {filteredSolicitudes.map((solicitud) => (
                  <Card key={solicitud.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{solicitud.nombreCurso}</h3>
                              <p className="text-sm text-gray-600">
                                {solicitud.id} • Ficha: {solicitud.numeroFicha} • v{solicitud.version}
                              </p>
                            </div>
                            <Badge className={estadoColors[solicitud.estado]}>{estadoLabels[solicitud.estado]}</Badge>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Solicitud: {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-CO")}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{solicitud.duracionHoras} horas</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>{solicitud.modalidad}</span>
                            </div>
                            {solicitud.numeroAprendices && (
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{solicitud.numeroAprendices} aprendices</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{solicitud.tipoFormacion}</Badge>
                            <Badge variant="outline">{solicitud.modalidad}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          {solicitud.estado === "borrador" && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          )}
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportPDF(solicitud)}
                              title="Exportar PDF"
                            >
                              PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportExcel(solicitud)}
                              title="Exportar Excel"
                            >
                              Excel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {filteredSolicitudes.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron solicitudes</h3>
                    <p className="text-gray-600 mb-4">
                      {solicitudes.length === 0
                        ? "Aún no has creado ninguna solicitud de formación complementaria"
                        : "Intenta ajustar los filtros de búsqueda"}
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Nueva Solicitud</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="exportar" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="h-5 w-5 text-red-600" />
                      <span>Exportar a PDF</span>
                    </CardTitle>
                    <CardDescription>Genere reportes en formato PDF con el diseño oficial del SENA</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Incluye:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Formato oficial de solicitud</li>
                        <li>Logos y membrete del SENA</li>
                        <li>Información completa de la solicitud</li>
                        <li>Firmas digitales y códigos QR</li>
                      </ul>
                    </div>
                    <Button
                      onClick={() => handleExportAll("pdf")}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Todo a PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <span>Exportar a Excel</span>
                    </CardTitle>
                    <CardDescription>Genere hojas de cálculo para análisis y reportes estadísticos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Incluye:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Datos estructurados en tablas</li>
                        <li>Gráficos y estadísticas</li>
                        <li>Filtros y tablas dinámicas</li>
                        <li>Formato para análisis de datos</li>
                      </ul>
                    </div>
                    <Button
                      onClick={() => handleExportAll("excel")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Exportar Todo a Excel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
