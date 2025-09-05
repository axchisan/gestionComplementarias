"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { SolicitudForm } from "@/components/solicitud-form"

interface EditarSolicitudFormProps {
  solicitudId: string
}

export function EditarSolicitudForm({ solicitudId }: EditarSolicitudFormProps) {
  const { token } = useAuth()
  const router = useRouter()
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSolicitud = async () => {
      if (!token || !solicitudId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/solicitudes/${solicitudId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setSolicitud(data.solicitud)
        } else {
          setError("No se pudo cargar la solicitud")
        }
      } catch (error) {
        console.error("Error loading solicitud:", error)
        setError("Error al cargar la solicitud")
      } finally {
        setLoading(false)
      }
    }

    loadSolicitud()
  }, [token, solicitudId])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitud...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !solicitud) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar la solicitud</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-2 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if solicitud can be edited
  if (solicitud.estado !== "BORRADOR" && solicitud.estado !== "PENDIENTE") {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-12 w-12 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Solicitud no editable</h3>
          <p className="text-gray-600 mb-4">
            Esta solicitud no puede ser editada porque su estado es "{solicitud.estado}". Solo se pueden editar
            solicitudes en estado "Borrador" o "Pendiente".
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Editando Solicitud</CardTitle>
          <CardDescription>
            Está editando la solicitud {solicitud.codigo}. Los cambios se guardarán automáticamente.
          </CardDescription>
        </CardHeader>
      </Card>

      <SolicitudForm initialData={solicitud} isEditing={true} />
    </div>
  )
}
