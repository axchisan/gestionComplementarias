"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Edit, FileText, Calendar, Clock, User, Filter, FileSpreadsheet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Solicitud {
  id: string
  codigo: string
  numeroFicha?: string
  estado: string
  fechaCaracterizacion: string
  fechaSolicitud: string
  fechaInicioCurso: string
  numeroAprendicesInscribir: number
  instructor: {
    name: string
    email: string
  }
  programa: {
    nombre: string
    codigo: string
    duracionHoras: number
    modalidad: string
  }
}

const estadoColors = {
  BORRADOR: "bg-gray-100 text-gray-800",
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  EN_REVISION: "bg-blue-100 text-blue-800",
  APROBADA: "bg-green-100 text-green-800",
  RECHAZADA: "bg-red-100 text-red-800",
}

const estadoLabels = {
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_REVISION: "En Revisión",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
}

export function HistorialSolicitudes() {
  const { user, token } = useAuth()
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstado, setSelectedEstado] = useState("todas")
  const [selectedYear, setSelectedYear] = useState("todos")

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const response = await fetch("/api/solicitudes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar las solicitudes")
        }

        const data = await response.json()
        setSolicitudes(data.solicitudes || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchSolicitudes()
  }, [token, user])

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const matchesSearch =
      (solicitud.programa?.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (solicitud.codigo?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (solicitud.numeroFicha?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesEstado = selectedEstado === "todas" || solicitud.estado === selectedEstado

    const solicitudDate = solicitud.fechaSolicitud ? new Date(solicitud.fechaSolicitud) : new Date()
    const year = solicitudDate.getFullYear().toString()
    const matchesYear = selectedYear === "todos" || year === selectedYear

    return matchesSearch && matchesEstado && matchesYear
  })

  const handleExportPDF = async (solicitud: Solicitud) => {
    try {
      const response = await fetch(`/api/solicitudes/${solicitud.id}/export?format=pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `solicitud-${solicitud.codigo}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error al exportar PDF:", error)
    }
  }

  const handleExportExcel = async (solicitud: Solicitud) => {
    try {
      const response = await fetch(`/api/solicitudes/${solicitud.id}/export?format=excel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `solicitud-${solicitud.codigo}.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error al exportar Excel:", error)
    }
  }

  const handleExportAll = async (formato: "pdf" | "excel") => {
    try {
      const response = await fetch(`/api/solicitudes/export-all?format=${formato}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `todas-solicitudes.${formato === "pdf" ? "pdf" : "xlsx"}`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error(`Error al exportar ${formato}:`, error)
    }
  }

  const getEstadisticas = () => {
    return {
      total: solicitudes.length,
      borradores: solicitudes.filter((s) => s.estado === "BORRADOR").length,
      pendientes: solicitudes.filter((s) => s.estado === "PENDIENTE").length,
      aprobadas: solicitudes.filter((s) => s.estado === "APROBADA").length,
      rechazadas: solicitudes.filter((s) => s.estado === "RECHAZADA").length,
    }
  }

  const stats = getEstadisticas()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitudes...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar solicitudes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

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
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
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
                    <SelectItem value="BORRADOR">Borradores</SelectItem>
                    <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                    <SelectItem value="EN_REVISION">En Revisión</SelectItem>
                    <SelectItem value="APROBADA">Aprobadas</SelectItem>
                    <SelectItem value="RECHAZADA">Rechazadas</SelectItem>
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

                <Button
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedEstado("todas")
                    setSelectedYear("todos")
                  }}
                >
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
                              <h3 className="text-lg font-semibold text-gray-900">{solicitud.programa.nombre}</h3>
                              <p className="text-sm text-gray-600">
                                {solicitud.codigo}
                                {solicitud.numeroFicha && ` • Ficha: ${solicitud.numeroFicha}`}
                              </p>
                            </div>
                            <Badge className={estadoColors[solicitud.estado] || "bg-gray-100 text-gray-800"}>
                              {estadoLabels[solicitud.estado] || solicitud.estado}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Solicitud:{" "}
                                {solicitud.fechaSolicitud
                                  ? format(new Date(solicitud.fechaSolicitud), "PPP", { locale: es })
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{solicitud.programa.duracionHoras} horas</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>{solicitud.programa.modalidad}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{solicitud.numeroAprendicesInscribir} aprendices</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Complementaria</Badge>
                            <Badge variant="outline">{solicitud.programa.modalidad}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => (window.location.href = `/solicitudes/${solicitud.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          {(solicitud.estado === "PENDIENTE" || solicitud.estado === "BORRADOR") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => (window.location.href = `/editar-solicitud/${solicitud.id}`)}
                            >
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
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => (window.location.href = "/nueva-solicitud")}
                    >
                      Nueva Solicitud
                    </Button>
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
