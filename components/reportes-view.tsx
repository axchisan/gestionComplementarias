"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Download, FileText, TrendingUp, Users, Clock, Award, PieChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReportesView() {
  const [fechaInicio, setFechaInicio] = useState<Date>()
  const [fechaFin, setFechaFin] = useState<Date>()
  const [tipoReporte, setTipoReporte] = useState("general")

  // Datos simulados para los reportes
  const estadisticas = {
    totalSolicitudes: 24,
    solicitudesAprobadas: 18,
    solicitudesPendientes: 4,
    solicitudesRechazadas: 2,
    horasFormacion: 1240,
    cursosCompletados: 15,
    tasaAprobacion: 75,
    promedioTiempoRespuesta: 3.2,
  }

  const solicitudesPorMes = [
    { mes: "Enero", solicitudes: 8, aprobadas: 6 },
    { mes: "Febrero", solicitudes: 12, aprobadas: 9 },
    { mes: "Marzo", solicitudes: 4, aprobadas: 3 },
  ]

  const cursosMasSolicitados = [
    { nombre: "Excel Avanzado", solicitudes: 8, porcentaje: 33 },
    { nombre: "Fundamentos de Programación", solicitudes: 6, porcentaje: 25 },
    { nombre: "Metodologías Ágiles", solicitudes: 4, porcentaje: 17 },
    { nombre: "Bases de Datos", solicitudes: 3, porcentaje: 13 },
    { nombre: "Otros", solicitudes: 3, porcentaje: 12 },
  ]

  const handleGenerateReport = (formato: "pdf" | "excel") => {
    console.log(`Generando reporte en formato ${formato}`)
    // Aquí iría la lógica para generar el reporte
  }

  return (
    <div className="space-y-8">
      {/* Configuración de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <span>Centro de Reportes Avanzados</span>
          </CardTitle>
          <CardDescription>Genera reportes detallados y analiza tendencias del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="configuracion" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="configuracion">Configuración</TabsTrigger>
              <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
              <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
              <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
            </TabsList>

            <TabsContent value="configuracion" className="space-y-4">
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
                  <Select value={tipoReporte} onValueChange={setTipoReporte}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Reporte General</SelectItem>
                      <SelectItem value="por_instructor">Por Instructor</SelectItem>
                      <SelectItem value="por_curso">Por Curso</SelectItem>
                      <SelectItem value="por_centro">Por Centro</SelectItem>
                      <SelectItem value="por_estado">Por Estado</SelectItem>
                      <SelectItem value="financiero">Análisis Financiero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ultimo_mes">Último Mes</SelectItem>
                      <SelectItem value="ultimo_trimestre">Último Trimestre</SelectItem>
                      <SelectItem value="ultimo_semestre">Último Semestre</SelectItem>
                      <SelectItem value="ultimo_ano">Último Año</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Formato de salida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Ejecutivo</SelectItem>
                      <SelectItem value="excel">Excel Detallado</SelectItem>
                      <SelectItem value="powerpoint">PowerPoint</SelectItem>
                      <SelectItem value="csv">CSV Datos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end space-x-2">
                  <Button
                    onClick={() => handleGenerateReport("pdf")}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generar
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="estadisticas" className="space-y-6">
              {/* Estadísticas Generales Mejoradas */}
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
                        <p className="text-3xl font-bold text-gray-900">{estadisticas.totalSolicitudes}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium text-sm">+12%</span>
                          <span className="text-gray-500 ml-1 text-sm">vs mes anterior</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tasa de Aprobación</p>
                        <p className="text-3xl font-bold text-gray-900">{estadisticas.tasaAprobacion}%</p>
                        <div className="mt-2">
                          <Progress value={estadisticas.tasaAprobacion} className="h-2" />
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Horas de Formación</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {estadisticas.horasFormacion.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Promedio: 52h por curso</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                        <p className="text-3xl font-bold text-gray-900">{estadisticas.promedioTiempoRespuesta}</p>
                        <p className="text-sm text-gray-500">días promedio</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tendencias" className="space-y-6">
              {/* Gráficos de Tendencias Mejorados */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <span>Evolución Mensual</span>
                    </CardTitle>
                    <CardDescription>Solicitudes enviadas vs aprobadas por mes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {solicitudesPorMes.map((mes, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">{mes.mes} 2024</span>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {mes.aprobadas}/{mes.solicitudes}
                              </div>
                              <div className="text-xs text-gray-500">
                                {Math.round((mes.aprobadas / mes.solicitudes) * 100)}% aprobación
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Enviadas</span>
                              <span>{mes.solicitudes}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(mes.solicitudes / 15) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Aprobadas</span>
                              <span>{mes.aprobadas}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(mes.aprobadas / 15) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-green-600" />
                      <span>Distribución por Categoría</span>
                    </CardTitle>
                    <CardDescription>Cursos más solicitados y su impacto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cursosMasSolicitados.map((curso, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{curso.nombre}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{curso.solicitudes}</span>
                              <Badge variant="outline" className="text-xs">
                                {curso.porcentaje}%
                              </Badge>
                            </div>
                          </div>
                          <div className="relative">
                            <Progress value={curso.porcentaje} className="h-3" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-white drop-shadow">
                                {curso.solicitudes} solicitudes
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparativo" className="space-y-6">
              {/* Análisis Comparativo */}
              <Card>
                <CardHeader>
                  <CardTitle>Análisis Comparativo por Centro</CardTitle>
                  <CardDescription>Rendimiento y eficiencia de cada centro de formación</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        centro: "Centro de Gestión Agroempresarial",
                        solicitudes: 45,
                        aprobadas: 42,
                        tiempo: 2.1,
                        satisfaccion: 94,
                      },
                      {
                        centro: "Centro de Biotecnología",
                        solicitudes: 38,
                        aprobadas: 31,
                        tiempo: 3.2,
                        satisfaccion: 89,
                      },
                      {
                        centro: "Centro de Comercio y Servicios",
                        solicitudes: 29,
                        aprobadas: 26,
                        tiempo: 2.8,
                        satisfaccion: 91,
                      },
                      {
                        centro: "Centro de Tecnologías",
                        solicitudes: 22,
                        aprobadas: 18,
                        tiempo: 4.1,
                        satisfaccion: 85,
                      },
                    ].map((centro, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-900">{centro.centro}</h4>
                          <Badge className="bg-green-100 text-green-800">
                            {Math.round((centro.aprobadas / centro.solicitudes) * 100)}% aprobación
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Solicitudes</p>
                            <p className="font-semibold text-gray-900">{centro.solicitudes}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Aprobadas</p>
                            <p className="font-semibold text-green-600">{centro.aprobadas}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Tiempo Promedio</p>
                            <p className="font-semibold text-blue-600">{centro.tiempo} días</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Satisfacción</p>
                            <p className="font-semibold text-purple-600">{centro.satisfaccion}%</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <Progress value={(centro.aprobadas / centro.solicitudes) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
