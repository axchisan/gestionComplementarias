"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, FileSpreadsheet, Users, FileText, Clock, Target, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface ReporteEstadisticas {
  totalSolicitudes: number
  solicitudesPendientes: number
  solicitudesAprobadas: number
  solicitudesRechazadas: number
  totalInstructores: number
  totalAprendices: number
  tasaAprobacion: number
  tiempoPromedioRespuesta: number
}

export function ReportesCoordinadorView() {
  const { token } = useAuth()
  const [estadisticas, setEstadisticas] = useState<ReporteEstadisticas>({
    totalSolicitudes: 0,
    solicitudesPendientes: 0,
    solicitudesAprobadas: 0,
    solicitudesRechazadas: 0,
    totalInstructores: 0,
    totalAprendices: 0,
    tasaAprobacion: 0,
    tiempoPromedioRespuesta: 0,
  })
  const [loading, setLoading] = useState(true)
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [tipoReporte, setTipoReporte] = useState("general")

  useEffect(() => {
    if (token) {
      loadEstadisticas()
    }
  }, [token, fechaInicio, fechaFin])

  const loadEstadisticas = async () => {
    if (!token) return

    setLoading(true)
    try {
      // Cargar solicitudes
      let urlSolicitudes = "/api/solicitudes?limit=1000"
      if (fechaInicio) urlSolicitudes += `&fechaInicio=${fechaInicio}`
      if (fechaFin) urlSolicitudes += `&fechaFin=${fechaFin}`

      const [solicitudesResponse, instructoresResponse] = await Promise.all([
        fetch(urlSolicitudes, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/instructores", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (solicitudesResponse.ok && instructoresResponse.ok) {
        const solicitudesData = await solicitudesResponse.json()
        const instructoresData = await instructoresResponse.json()

        const solicitudes = solicitudesData.solicitudes || []
        const instructores = instructoresData.instructores || []

        const pendientes = solicitudes.filter((s: any) => s.estado === "PENDIENTE").length
        const aprobadas = solicitudes.filter((s: any) => s.estado === "APROBADA").length
        const rechazadas = solicitudes.filter((s: any) => s.estado === "RECHAZADA").length
        const totalAprendices = solicitudes.reduce((sum: number, s: any) => sum + (s.numeroAprendicesInscribir || 0), 0)
        const tasaAprobacion = solicitudes.length > 0 ? (aprobadas / solicitudes.length) * 100 : 0

        setEstadisticas({
          totalSolicitudes: solicitudes.length,
          solicitudesPendientes: pendientes,
          solicitudesAprobadas: aprobadas,
          solicitudesRechazadas: rechazadas,
          totalInstructores: instructores.length,
          totalAprendices,
          tasaAprobacion: Math.round(tasaAprobacion),
          tiempoPromedioRespuesta: 2.5, // Placeholder
        })
      }
    } catch (error) {
      console.error("Error loading estadisticas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = async (format: "pdf" | "excel") => {
    try {
      let url = `/api/solicitudes/export-all?format=${format}`
      if (fechaInicio) url += `&fechaInicio=${fechaInicio}`
      if (fechaFin) url += `&fechaFin=${fechaFin}`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = downloadUrl
        a.download = `reporte-coordinador-${format === "pdf" ? "pdf" : "xlsx"}`
        a.click()
        window.URL.revokeObjectURL(downloadUrl)
      }
    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="ml-3 text-gray-600">Cargando reportes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Fecha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <span>Configuración de Reportes</span>
          </CardTitle>
          <CardDescription>Selecciona el rango de fechas y tipo de reporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha Inicio</label>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha Fin</label>
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de Reporte</label>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Reporte General</SelectItem>
                  <SelectItem value="instructores">Por Instructores</SelectItem>
                  <SelectItem value="programas">Por Programas</SelectItem>
                  <SelectItem value="estados">Por Estados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={loadEstadisticas} disabled={loading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Principales */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalSolicitudes}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.solicitudesPendientes}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa Aprobación</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.tasaAprobacion}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Aprendices</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalAprendices}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Reportes */}
      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resumen">Resumen Ejecutivo</TabsTrigger>
          <TabsTrigger value="detallado">Análisis Detallado</TabsTrigger>
          <TabsTrigger value="exportar">Exportar Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aprobadas</span>
                    <Badge className="bg-green-100 text-green-800">{estadisticas.solicitudesAprobadas}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pendientes</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{estadisticas.solicitudesPendientes}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rechazadas</span>
                    <Badge className="bg-red-100 text-red-800">{estadisticas.solicitudesRechazadas}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Instructores Activos</span>
                    <span className="font-semibold">{estadisticas.totalInstructores}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tiempo Promedio Respuesta</span>
                    <span className="font-semibold">{estadisticas.tiempoPromedioRespuesta} días</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Eficiencia de Aprobación</span>
                    <span className="font-semibold">{estadisticas.tasaAprobacion}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detallado" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado por Período</CardTitle>
              <CardDescription>Información detallada sobre el desempeño en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis en Desarrollo</h3>
                <p className="text-gray-600">
                  Los gráficos detallados y análisis avanzados estarán disponibles próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exportar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exportar Reportes</CardTitle>
              <CardDescription>Descarga reportes en diferentes formatos para análisis offline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Reporte en PDF</h4>
                  <p className="text-sm text-gray-600">
                    Descarga un reporte ejecutivo en formato PDF con gráficos y estadísticas.
                  </p>
                  <Button
                    onClick={() => handleExportReport("pdf")}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Datos en Excel</h4>
                  <p className="text-sm text-gray-600">
                    Exporta todos los datos en formato Excel para análisis personalizado.
                  </p>
                  <Button
                    onClick={() => handleExportReport("excel")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Descargar Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
