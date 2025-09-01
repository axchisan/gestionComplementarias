"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Edit, FileText, Calendar, Clock, User } from "lucide-react"

interface Solicitud {
  id: string
  numeroFicha: string
  nombreCurso: string
  instructor: string
  fechaSolicitud: string
  fechaInicio: string
  duracionHoras: number
  modalidad: string
  estado: "pendiente" | "aprobada" | "rechazada" | "en_revision"
  tipoFormacion: string
}

const solicitudes: Solicitud[] = [
  {
    id: "SOL-2024-001",
    numeroFicha: "2024001",
    nombreCurso: "Excel Avanzado para Análisis de Datos",
    instructor: "María González",
    fechaSolicitud: "2024-01-15",
    fechaInicio: "2024-02-15",
    duracionHoras: 40,
    modalidad: "Presencial",
    estado: "aprobada",
    tipoFormacion: "Complementaria",
  },
  {
    id: "SOL-2024-002",
    numeroFicha: "2024002",
    nombreCurso: "Fundamentos de Programación Python",
    instructor: "María González",
    fechaSolicitud: "2024-01-20",
    fechaInicio: "2024-03-01",
    duracionHoras: 60,
    modalidad: "Virtual",
    estado: "en_revision",
    tipoFormacion: "Complementaria",
  },
  {
    id: "SOL-2024-003",
    numeroFicha: "2024003",
    nombreCurso: "Metodologías Ágiles - Scrum",
    instructor: "María González",
    fechaSolicitud: "2024-01-25",
    fechaInicio: "2024-02-20",
    duracionHoras: 30,
    modalidad: "Mixta",
    estado: "pendiente",
    tipoFormacion: "Transversal",
  },
  {
    id: "SOL-2023-045",
    numeroFicha: "2023045",
    nombreCurso: "Diseño de Bases de Datos",
    instructor: "María González",
    fechaSolicitud: "2023-11-10",
    fechaInicio: "2023-12-01",
    duracionHoras: 50,
    modalidad: "Presencial",
    estado: "rechazada",
    tipoFormacion: "Específica",
  },
]

const estadoColors = {
  pendiente: "bg-yellow-100 text-yellow-800",
  aprobada: "bg-green-100 text-green-800",
  rechazada: "bg-red-100 text-red-800",
  en_revision: "bg-blue-100 text-blue-800",
}

const estadoLabels = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  en_revision: "En Revisión",
}

export function SolicitudesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstado, setSelectedEstado] = useState("todos")
  const [selectedTipo, setSelectedTipo] = useState("todos")

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const matchesSearch =
      solicitud.nombreCurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.numeroFicha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = selectedEstado === "todos" || solicitud.estado === selectedEstado
    const matchesTipo = selectedTipo === "todos" || solicitud.tipoFormacion.toLowerCase() === selectedTipo

    return matchesSearch && matchesEstado && matchesTipo
  })

  const handleExportPDF = (solicitud: Solicitud) => {
    console.log("Exportar PDF:", solicitud.id)
    // Aquí iría la lógica para generar PDF
  }

  const handleExportExcel = (solicitud: Solicitud) => {
    console.log("Exportar Excel:", solicitud.id)
    // Aquí iría la lógica para generar Excel
  }

  return (
    <div className="space-y-6">
      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar solicitudes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por Estado */}
            <Select value={selectedEstado} onValueChange={setSelectedEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
                <SelectItem value="aprobada">Aprobada</SelectItem>
                <SelectItem value="rechazada">Rechazada</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por Tipo */}
            <Select value={selectedTipo} onValueChange={setSelectedTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Formación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="complementaria">Complementaria</SelectItem>
                <SelectItem value="transversal">Transversal</SelectItem>
                <SelectItem value="específica">Específica</SelectItem>
              </SelectContent>
            </Select>

            {/* Botón de Exportar Todo */}
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar Todo</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: solicitudes.length, color: "bg-gray-100 text-gray-800" },
          {
            label: "Aprobadas",
            value: solicitudes.filter((s) => s.estado === "aprobada").length,
            color: "bg-green-100 text-green-800",
          },
          {
            label: "En Revisión",
            value: solicitudes.filter((s) => s.estado === "en_revision").length,
            color: "bg-blue-100 text-blue-800",
          },
          {
            label: "Pendientes",
            value: solicitudes.filter((s) => s.estado === "pendiente").length,
            color: "bg-yellow-100 text-yellow-800",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <Badge className={stat.color}>{stat.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de Solicitudes */}
      <div className="space-y-4">
        {filteredSolicitudes.map((solicitud) => (
          <Card key={solicitud.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{solicitud.nombreCurso}</h3>
                      <p className="text-sm text-gray-600">
                        Solicitud: {solicitud.id} • Ficha: {solicitud.numeroFicha}
                      </p>
                    </div>
                    <Badge className={estadoColors[solicitud.estado]}>{estadoLabels[solicitud.estado]}</Badge>
                  </div>

                  {/* Detalles */}
                  <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{solicitud.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{solicitud.duracionHoras} horas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Inicio: {new Date(solicitud.fechaInicio).toLocaleDateString("es-CO")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>{solicitud.modalidad}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{solicitud.tipoFormacion}</Badge>
                    <Badge variant="outline">{solicitud.modalidad}</Badge>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  {solicitud.estado === "pendiente" && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  )}
                  <div className="flex items-center space-x-1">
                    <Button variant="outline" size="sm" onClick={() => handleExportPDF(solicitud)} title="Exportar PDF">
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
            <p className="text-gray-600 mb-4">Intenta ajustar los filtros o crear una nueva solicitud</p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Nueva Solicitud</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
