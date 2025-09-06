"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
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
  Filter,
  Building,
  Download,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  CalendarDays,
  FileSpreadsheet,
  Bell,
  Target,
  Activity,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { SolicitudDetalleModal } from "@/components/solicitud-detalle-modal"
import { RegistrarInstructorForm } from "@/components/registrar-instructor-form"

interface Solicitud {
  id: string
  codigo: string
  estado: string
  fechaInicio: string
  fechaFin: string
  numeroAprendices: number
  nombreEmpresa: string
  justificacion: string
  createdAt: string
  fechaAprobacion?: string
  prioridad?: "ALTA" | "MEDIA" | "BAJA"
  tiempoRespuesta?: number // días desde creación
  instructor: {
    name: string
    email: string
    especialidad?: string
  }
  programa: {
    nombre: string
    codigo: string
    duracionHoras: number
    modalidad: string
    tipoFormacion: string
    centro: {
      nombre: string
    }
  }
  horarios: Array<{
    id: string
    diaSemana: string
    horaInicio: string
    horaFin: string
  }>
}

interface Instructor {
  id: string
  name: string
  email: string
  cedula: string
  telefono?: string
  especialidad?: string
  fechaIngreso?: string
  estado: string
  fichasAsignadas: Array<{
    numero: string
    programa: string
    aprendices: number
  }>
  solicitudesFormacion: number
  horasFormacion: number
  rendimiento?: number // porcentaje de aprobación
}

interface EstadisticasAvanzadas {
  solicitudesPendientes: number
  solicitudesEnRevision: number
  aprobadasEsteMes: number
  totalInstructores: number
  instructoresActivos: number
  totalSolicitudesActivas: number
  totalAprendices: number
  tasaAprobacion: number
  tiempoPromedioRespuesta: number
  solicitudesUrgentes: number
  tendenciaMensual: number
  metasMensuales: {
    solicitudesProcesadas: { actual: number; meta: number }
    tiempoRespuesta: { actual: number; meta: number }
    satisfaccionInstructores: { actual: number; meta: number }
  }
}

export function CoordinadorDashboard() {
  const { user, token } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [fechaInicioFilter, setFechaInicioFilter] = useState("")
  const [fechaFinFilter, setFechaFinFilter] = useState("")
  const [tipoFormacionFilter, setTipoFormacionFilter] = useState("all")
  const [prioridadFilter, setPrioridadFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false)
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showRegistroForm, setShowRegistroForm] = useState(false)

  const [selectedSolicitudes, setSelectedSolicitudes] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [instructores, setInstructores] = useState<Instructor[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasAvanzadas>({
    solicitudesPendientes: 0,
    solicitudesEnRevision: 0,
    aprobadasEsteMes: 0,
    totalInstructores: 0,
    instructoresActivos: 0,
    totalSolicitudesActivas: 0,
    totalAprendices: 0,
    tasaAprobacion: 0,
    tiempoPromedioRespuesta: 0,
    solicitudesUrgentes: 0,
    tendenciaMensual: 0,
    metasMensuales: {
      solicitudesProcesadas: { actual: 0, meta: 50 },
      tiempoRespuesta: { actual: 0, meta: 3 },
      satisfaccionInstructores: { actual: 0, meta: 90 },
    },
  })

  useEffect(() => {
    if (user && token) {
      loadDashboardData()
    }
  }, [user, token])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadSolicitudes(), loadInstructores(), loadAnalytics()])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSolicitudes = async () => {
    if (!token) return

    setLoadingSolicitudes(true)
    try {
      let url = `/api/solicitudes?limit=100`

      if (estadoFilter !== "all") url += `&estado=${estadoFilter}`
      if (tipoFormacionFilter !== "all") url += `&tipoFormacion=${tipoFormacionFilter}`
      if (fechaInicioFilter) url += `&fechaInicio=${fechaInicioFilter}`
      if (fechaFinFilter) url += `&fechaFin=${fechaFinFilter}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const solicitudesConPrioridad =
          data.solicitudes?.map((s: Solicitud) => ({
            ...s,
            prioridad: calcularPrioridad(s),
            tiempoRespuesta: calcularTiempoRespuesta(s.createdAt),
          })) || []

        setSolicitudes(solicitudesConPrioridad)
        calcularEstadisticas(solicitudesConPrioridad)
      }
    } catch (error) {
      console.error("Error loading solicitudes:", error)
    } finally {
      setLoadingSolicitudes(false)
    }
  }

  const calcularPrioridad = (solicitud: Solicitud): "ALTA" | "MEDIA" | "BAJA" => {
    const diasDesdeCreacion = calcularTiempoRespuesta(solicitud.createdAt)
    const esComplementaria = solicitud.programa.tipoFormacion === "COMPLEMENTARIA"
    const muchoAprendices = solicitud.numeroAprendices > 25

    if (diasDesdeCreacion > 7 || (esComplementaria && muchoAprendices)) return "ALTA"
    if (diasDesdeCreacion > 3 || muchoAprendices) return "MEDIA"
    return "BAJA"
  }

  const calcularTiempoRespuesta = (fechaCreacion: string): number => {
    const ahora = new Date()
    const creacion = new Date(fechaCreacion)
    return Math.floor((ahora.getTime() - creacion.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calcularEstadisticas = (solicitudesData: Solicitud[]) => {
    const pendientes = solicitudesData.filter((s) => s.estado === "PENDIENTE").length
    const enRevision = solicitudesData.filter((s) => s.estado === "EN_REVISION").length
    const aprobadas = solicitudesData.filter((s) => s.estado === "APROBADA").length

    // Calculate approved this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const aprobadasEsteMes = solicitudesData.filter(
      (s) => s.estado === "APROBADA" && s.fechaAprobacion && new Date(s.fechaAprobacion) >= thisMonth,
    ).length

    const total = solicitudesData.length
    const urgentes = solicitudesData.filter((s) => s.prioridad === "ALTA").length
    const tiempoPromedio = solicitudesData.reduce((sum, s) => sum + (s.tiempoRespuesta || 0), 0) / total || 0
    const tasaAprobacion = total > 0 ? (aprobadas / total) * 100 : 0

    setEstadisticas((prev) => ({
      ...prev,
      solicitudesPendientes: pendientes,
      solicitudesEnRevision: enRevision,
      aprobadasEsteMes: aprobadasEsteMes,
      solicitudesUrgentes: urgentes,
      tasaAprobacion: Math.round(tasaAprobacion),
      tiempoPromedioRespuesta: Math.round(tiempoPromedio),
      metasMensuales: {
        ...prev.metasMensuales,
        solicitudesProcesadas: { ...prev.metasMensuales.solicitudesProcesadas, actual: aprobadasEsteMes },
        tiempoRespuesta: { ...prev.metasMensuales.tiempoRespuesta, actual: Math.round(tiempoPromedio) },
      },
    }))
  }

  const loadAnalytics = async () => {
    setEstadisticas((prev) => ({
      ...prev,
      tendenciaMensual: 15, // 15% de incremento
      metasMensuales: {
        solicitudesProcesadas: { actual: 42, meta: 50 },
        tiempoRespuesta: { actual: 2.5, meta: 3 },
        satisfaccionInstructores: { actual: 87, meta: 90 },
      },
    }))
  }

  const loadInstructores = async () => {
    if (!token) return

    try {
      const response = await fetch("/api/instructores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const instructoresData = data.instructores || []

        setInstructores(instructoresData)
        setEstadisticas((prev) => ({
          ...prev,
          totalInstructores: instructoresData.length,
          instructoresActivos: instructoresData.filter((i: any) => i.isActive).length,
          totalAprendices: instructoresData.reduce(
            (sum: number, i: any) => sum + (i.estadisticas?.totalAprendices || 0),
            0,
          ),
        }))
      } else {
        console.error("Error fetching instructores:", response.statusText)
      }
    } catch (error) {
      console.error("Error loading instructores:", error)
      // Fallback to empty array on error
      setInstructores([])
    }
  }

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const matchesSearch =
      solicitud.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.programa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitud.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = estadoFilter === "all" || solicitud.estado === estadoFilter.toUpperCase()
    const matchesTipo = tipoFormacionFilter === "all" || solicitud.programa.tipoFormacion === tipoFormacionFilter
    const matchesPrioridad = prioridadFilter === "all" || solicitud.prioridad === prioridadFilter

    return matchesSearch && matchesStatus && matchesTipo && matchesPrioridad
  })

  const handleSelectSolicitud = (solicitudId: string, checked: boolean) => {
    if (checked) {
      setSelectedSolicitudes((prev) => [...prev, solicitudId])
    } else {
      setSelectedSolicitudes((prev) => prev.filter((id) => id !== solicitudId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendientes = filteredSolicitudes.filter((s) => s.estado === "PENDIENTE").map((s) => s.id)
      setSelectedSolicitudes(pendientes)
    } else {
      setSelectedSolicitudes([])
    }
  }

  const handleBulkApprove = async () => {
    if (selectedSolicitudes.length === 0) return

    setBulkActionLoading(true)
    try {
      const comentarios = prompt("Comentarios para la aprobación en lote (opcional):")

      const promises = selectedSolicitudes.map((id) =>
        fetch(`/api/solicitudes/${id}/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comentarios }),
        }),
      )

      await Promise.all(promises)
      await loadSolicitudes()
      setSelectedSolicitudes([])
      alert(`${selectedSolicitudes.length} solicitudes aprobadas exitosamente`)
    } catch (error) {
      console.error("Error en aprobación en lote:", error)
      alert("Error en la aprobación en lote")
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkReject = async () => {
    if (selectedSolicitudes.length === 0) return

    setBulkActionLoading(true)
    try {
      const comentarios = prompt("Comentarios para el rechazo en lote (requerido):")
      if (!comentarios) return

      const promises = selectedSolicitudes.map((id) =>
        fetch(`/api/solicitudes/${id}/reject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comentarios }),
        }),
      )

      await Promise.all(promises)
      await loadSolicitudes()
      setSelectedSolicitudes([])
      alert(`${selectedSolicitudes.length} solicitudes rechazadas`)
    } catch (error) {
      console.error("Error en rechazo en lote:", error)
      alert("Error en el rechazo en lote")
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleExportSolicitudes = async (format: "pdf" | "excel") => {
    try {
      let url = `/api/solicitudes/export-all?format=${format}`
      if (estadoFilter !== "all") url += `&estado=${estadoFilter}`
      if (fechaInicioFilter) url += `&fechaInicio=${fechaInicioFilter}`
      if (fechaFinFilter) url += `&fechaFin=${fechaFinFilter}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url2 = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url2
        a.download = `solicitudes-${format === "pdf" ? "reporte" : "datos"}.${format === "pdf" ? "pdf" : "xlsx"}`
        a.click()
        window.URL.revokeObjectURL(url2)
      }
    } catch (error) {
      console.error(`Error exportando ${format}:`, error)
    }
  }

  const handleAprobarSolicitud = async (solicitudId: string) => {
    if (!token) return

    const comentarios = prompt("Ingrese comentarios adicionales para la aprobación (opcional):")

    try {
      const response = await fetch(`/api/solicitudes/${solicitudId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentarios }),
      })

      if (response.ok) {
        const data = await response.json()
        await loadSolicitudes() // Reload data
        alert(`Solicitud aprobada exitosamente. Número de ficha asignado: ${data.solicitud.numeroFicha}`)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error approving solicitud:", error)
      alert("Error al aprobar la solicitud")
    }
  }

  const handleRechazarSolicitud = async (solicitudId: string) => {
    if (!token) return

    const comentarios = prompt("Ingrese los comentarios para el rechazo (opcional):")

    try {
      const response = await fetch(`/api/solicitudes/${solicitudId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentarios }),
      })

      if (response.ok) {
        await loadSolicitudes() // Reload data
        alert("Solicitud rechazada exitosamente")
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error rejecting solicitud:", error)
      alert("Error al rechazar la solicitud")
    }
  }

  const handleVerDetalles = (solicitudId: string) => {
    setSelectedSolicitudId(solicitudId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedSolicitudId(null)
    setIsModalOpen(false)
  }

  const handleModalApprove = async (id: string, comentarios: string) => {
    const response = await fetch(`/api/solicitudes/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comentarios }),
    })

    if (response.ok) {
      const data = await response.json()
      await loadSolicitudes()
      alert(`Solicitud aprobada exitosamente. Número de ficha asignado: ${data.solicitud.numeroFicha}`)
    } else {
      const errorData = await response.json()
      alert(`Error: ${errorData.error}`)
    }
  }

  const handleModalReject = async (id: string, comentarios: string) => {
    const response = await fetch(`/api/solicitudes/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comentarios }),
    })

    if (response.ok) {
      await loadSolicitudes()
      alert("Solicitud rechazada exitosamente")
    } else {
      const errorData = await response.json()
      alert(`Error: ${errorData.error}`)
    }
  }

  const getStatusBadge = (estado: string, prioridad?: string) => {
    const priorityIcon = prioridad === "ALTA" ? <AlertTriangle className="h-3 w-3 mr-1" /> : null

    switch (estado) {
      case "PENDIENTE":
        return (
          <Badge className={`${prioridad === "ALTA" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
            {priorityIcon || <Clock className="h-3 w-3 mr-1" />}
            Pendiente {prioridad === "ALTA" ? "(Urgente)" : ""}
          </Badge>
        )
      case "APROBADA":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobada
          </Badge>
        )
      case "RECHAZADA":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazada
          </Badge>
        )
      case "BORRADOR":
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>
      case "EN_CURSO":
        return <Badge className="bg-blue-100 text-blue-800">En Curso</Badge>
      case "EN_REVISION":
        return <Badge className="bg-orange-100 text-orange-800">En Revisión</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const filteredInstructores = instructores.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.cedula.includes(searchTerm) ||
      (instructor.especialidad && instructor.especialidad.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="ml-3 text-gray-600">Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header de Bienvenida */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido, {user?.name}!</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Building className="h-4 w-4 text-gray-600" />
                <p className="text-gray-600">{user?.centro?.nombre}</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Gestiona las solicitudes de formación complementaria e instructores de tu centro
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setShowAnalytics(!showAnalytics)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
                {estadisticas.solicitudesUrgentes > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">{estadisticas.solicitudesUrgentes}</Badge>
                )}
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowRegistroForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Registrar Instructor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.solicitudesPendientes}</p>
                {estadisticas.solicitudesUrgentes > 0 && (
                  <p className="text-xs text-red-600">{estadisticas.solicitudesUrgentes} urgentes</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">En Revisión</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.solicitudesEnRevision}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Aprobadas Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.aprobadasEsteMes}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tasa Aprobación</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.tasaAprobacion}%</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <p className="text-xs text-green-600">+{estadisticas.tendenciaMensual}%</p>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tiempo Respuesta</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.tiempoPromedioRespuesta}d</p>
                <Progress value={((3 - estadisticas.tiempoPromedioRespuesta) / 3) * 100} className="h-1 mt-1" />
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Instructores</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalInstructores}</p>
                <p className="text-xs text-gray-600">{estadisticas.instructoresActivos} activos</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Aprendices</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalAprendices}</p>
                <p className="text-xs text-gray-600">Total matriculados</p>
              </div>
              <GraduationCap className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Meta Mensual</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.metasMensuales.solicitudesProcesadas.actual}/
                  {estadisticas.metasMensuales.solicitudesProcesadas.meta}
                </p>
                <Progress
                  value={
                    (estadisticas.metasMensuales.solicitudesProcesadas.actual /
                      estadisticas.metasMensuales.solicitudesProcesadas.meta) *
                    100
                  }
                  className="h-1 mt-1"
                />
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Panel de Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Metas del Mes</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Solicitudes Procesadas</span>
                      <span>
                        {estadisticas.metasMensuales.solicitudesProcesadas.actual}/
                        {estadisticas.metasMensuales.solicitudesProcesadas.meta}
                      </span>
                    </div>
                    <Progress
                      value={
                        (estadisticas.metasMensuales.solicitudesProcesadas.actual /
                          estadisticas.metasMensuales.solicitudesProcesadas.meta) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Tiempo Respuesta (días)</span>
                      <span>
                        {estadisticas.metasMensuales.tiempoRespuesta.actual}/
                        {estadisticas.metasMensuales.tiempoRespuesta.meta}
                      </span>
                    </div>
                    <Progress
                      value={
                        (1 -
                          estadisticas.metasMensuales.tiempoRespuesta.actual /
                            estadisticas.metasMensuales.tiempoRespuesta.meta) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Satisfacción Instructores</span>
                      <span>
                        {estadisticas.metasMensuales.satisfaccionInstructores.actual}%/
                        {estadisticas.metasMensuales.satisfaccionInstructores.meta}%
                      </span>
                    </div>
                    <Progress
                      value={
                        (estadisticas.metasMensuales.satisfaccionInstructores.actual /
                          estadisticas.metasMensuales.satisfaccionInstructores.meta) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Tendencias</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">Aprobaciones</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+{estadisticas.tendenciaMensual}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Tiempo Respuesta</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">-12%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Acciones Rápidas</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleExportSolicitudes("excel")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleExportSolicitudes("pdf")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Ver Calendario
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenido Principal */}
      <Tabs defaultValue="solicitudes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="solicitudes" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Gestionar Solicitudes</span>
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

        {/* Pestaña 1: Gestionar Solicitudes */}
        <TabsContent value="solicitudes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Solicitudes de Formación Complementaria</span>
                </div>
                {selectedSolicitudes.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{selectedSolicitudes.length} seleccionadas</span>
                    <Button
                      size="sm"
                      onClick={handleBulkApprove}
                      disabled={bulkActionLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprobar Todas
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBulkReject}
                      disabled={bulkActionLoading}
                      className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rechazar Todas
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>Revisa, aprueba o rechaza las solicitudes de formación de tu centro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar solicitudes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                    <SelectItem value="aprobada">Aprobadas</SelectItem>
                    <SelectItem value="rechazada">Rechazadas</SelectItem>
                    <SelectItem value="borrador">Borradores</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={prioridadFilter} onValueChange={setPrioridadFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las prioridades</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="MEDIA">Media</SelectItem>
                    <SelectItem value="BAJA">Baja</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={tipoFormacionFilter} onValueChange={setTipoFormacionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="COMPLEMENTARIA">Complementaria</SelectItem>
                    <SelectItem value="TRANSVERSAL">Transversal</SelectItem>
                    <SelectItem value="ESPECIFICA">Específica</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  placeholder="Fecha inicio"
                  value={fechaInicioFilter}
                  onChange={(e) => setFechaInicioFilter(e.target.value)}
                />

                <div className="flex space-x-2">
                  <Button onClick={loadSolicitudes} disabled={loadingSolicitudes} variant="outline" size="sm">
                    <RefreshCw className={`h-4 w-4 mr-1 ${loadingSolicitudes ? "animate-spin" : ""}`} />
                    Actualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setEstadoFilter("all")
                      setPrioridadFilter("all")
                      setTipoFormacionFilter("all")
                      setFechaInicioFilter("")
                      setFechaFinFilter("")
                    }}
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                </div>
              </div>

              {filteredSolicitudes.filter((s) => s.estado === "PENDIENTE").length > 0 && (
                <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    checked={
                      selectedSolicitudes.length === filteredSolicitudes.filter((s) => s.estado === "PENDIENTE").length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-600">
                    Seleccionar todas las solicitudes pendientes (
                    {filteredSolicitudes.filter((s) => s.estado === "PENDIENTE").length})
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {filteredSolicitudes.map((solicitud) => (
                  <Card key={solicitud.id} className="border-l-4 border-l-blue-400 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {solicitud.estado === "PENDIENTE" && (
                            <Checkbox
                              checked={selectedSolicitudes.includes(solicitud.id)}
                              onCheckedChange={(checked) => handleSelectSolicitud(solicitud.id, checked as boolean)}
                              className="mt-1"
                            />
                          )}

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h4 className="text-lg font-semibold text-gray-900">{solicitud.codigo}</h4>
                              {getStatusBadge(solicitud.estado, solicitud.prioridad)}
                              <Badge className="bg-blue-100 text-blue-800">
                                {solicitud.numeroAprendices} aprendices
                              </Badge>
                              {solicitud.tiempoRespuesta && solicitud.tiempoRespuesta > 5 && (
                                <Badge className="bg-orange-100 text-orange-800">
                                  {solicitud.tiempoRespuesta} días
                                </Badge>
                              )}
                            </div>

                            <h5 className="text-md font-medium text-gray-800 mb-2">{solicitud.programa.nombre}</h5>

                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>Instructor: {solicitud.instructor.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Building className="h-4 w-4" />
                                <span>Empresa: {solicitud.nombreEmpresa}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>Inicio: {format(new Date(solicitud.fechaInicio), "PPP", { locale: es })}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>Duración: {solicitud.programa.duracionHoras}h</span>
                              </div>
                            </div>

                            {solicitud.justificacion && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h6 className="font-medium text-gray-900 mb-2">Justificación:</h6>
                                <p className="text-sm text-gray-700 line-clamp-3">{solicitud.justificacion}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          {solicitud.estado === "PENDIENTE" && (
                            <>
                              <Button
                                onClick={() => handleAprobarSolicitud(solicitud.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                onClick={() => handleRechazarSolicitud(solicitud.id)}
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                                size="sm"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleVerDetalles(solicitud.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredSolicitudes.length === 0 && !loadingSolicitudes && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm || estadoFilter !== "all" ? "No se encontraron solicitudes" : "No hay solicitudes"}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || estadoFilter !== "all"
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "Las solicitudes de formación aparecerán aquí cuando los instructores las envíen"}
                    </p>
                  </div>
                )}

                {loadingSolicitudes && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Cargando solicitudes...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña 2: Registrar Instructores */}
        <TabsContent value="registro" className="space-y-6 mt-6">
          {showRegistroForm ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Registrar Nuevo Instructor</h3>
                <Button variant="outline" onClick={() => setShowRegistroForm(false)}>
                  Volver al Dashboard
                </Button>
              </div>
              <RegistrarInstructorForm />
            </div>
          ) : (
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
                  <p className="text-gray-600 mb-6">Registra nuevos instructores para tu centro de formación</p>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowRegistroForm(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Abrir Formulario de Registro
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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
                            <h4 className="text-lg font-semibold text-gray-900">{instructor.name}</h4>
                            <Badge className="bg-green-100 text-green-800">✅ {instructor.estado}</Badge>
                            <Badge className="bg-blue-100 text-blue-800">{instructor.especialidad}</Badge>
                            {instructor.rendimiento && (
                              <Badge
                                className={`${instructor.rendimiento >= 90 ? "bg-green-100 text-green-800" : instructor.rendimiento >= 80 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                              >
                                {instructor.rendimiento}% rendimiento
                              </Badge>
                            )}
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
                              <span>
                                Desde{" "}
                                {instructor.fechaIngreso
                                  ? format(new Date(instructor.fechaIngreso), "PPP", { locale: es })
                                  : "N/A"}
                              </span>
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

      <SolicitudDetalleModal
        solicitudId={selectedSolicitudId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
        userRole={user?.role}
      />
    </div>
  )
}
