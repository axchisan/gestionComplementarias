"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SolicitudPendiente {
  id: string
  numeroFicha: string
  nombreCurso: string
  instructor: string
  centro: string
  fechaSolicitud: string
  fechaInicio: string
  duracionHoras: number
  modalidad: string
  justificacion: string
  objetivos: string[]
  competencias: string[]
  estado: "pendiente" | "en_revision"
}

export function SolicitudesPendientes() {
  const { token } = useAuth()
  const [solicitudes, setSolicitudes] = useState<SolicitudPendiente[]>([])
  const [loading, setLoading] = useState(true)
  const [comentarios, setComentarios] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchSolicitudesPendientes = async () => {
      if (!token) return

      try {
        setLoading(true)
        const response = await fetch("/api/solicitudes?estado=pendiente,en_revision", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar solicitudes pendientes")
        }

        const data = await response.json()
        setSolicitudes(data.solicitudes || [])
      } catch (error) {
        console.error("Error fetching pending solicitudes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSolicitudesPendientes()
  }, [token])

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/solicitudes/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comentarios: comentarios[id] || "",
        }),
      })

      if (response.ok) {
        setSolicitudes((prev) => prev.filter((s) => s.id !== id))
        console.log(`Solicitud ${id} aprobada`)
      }
    } catch (error) {
      console.error("Error approving solicitud:", error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/solicitudes/${id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comentarios: comentarios[id] || "",
        }),
      })

      if (response.ok) {
        setSolicitudes((prev) => prev.filter((s) => s.id !== id))
        console.log(`Solicitud ${id} rechazada`)
      }
    } catch (error) {
      console.error("Error rejecting solicitud:", error)
    }
  }

  const handleSetInReview = async (id: string) => {
    try {
      const response = await fetch(`/api/solicitudes/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "en_revision",
        }),
      })

      if (response.ok) {
        setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado: "en_revision" as const } : s)))
      }
    } catch (error) {
      console.error("Error updating solicitud status:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitudes pendientes...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {solicitudes.filter((s) => s.estado === "pendiente").length}
            </div>
            <div className="text-sm text-gray-600">Pendientes de Revisión</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {solicitudes.filter((s) => s.estado === "en_revision").length}
            </div>
            <div className="text-sm text-gray-600">En Revisión</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-sm text-gray-600">Aprobadas Este Mes</div>
          </CardContent>
        </Card>
      </div>

      {/* ... existing code for Lista de Solicitudes ... */}

      {/* Empty State */}
      {solicitudes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Excelente trabajo!</h3>
            <p className="text-gray-600">No hay solicitudes pendientes de revisión en este momento.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
