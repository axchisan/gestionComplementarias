"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, CheckCheck, Clock, FileText, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Notificacion {
  id: string
  tipo: string
  titulo: string
  mensaje: string
  leida: boolean
  fechaCreada: string
  solicitud?: {
    codigo: string
    programa: {
      nombre: string
    }
  }
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { token } = useAuth()
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(false)
  const [noLeidas, setNoLeidas] = useState(0)

  useEffect(() => {
    if (isOpen && token) {
      loadNotificaciones()
    }
  }, [isOpen, token])

  const loadNotificaciones = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/notificaciones?limit=20", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotificaciones(data.notificaciones || [])
        setNoLeidas(data.noLeidas || 0)
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const marcarComoLeida = async (id: string) => {
    try {
      const response = await fetch(`/api/notificaciones/${id}/marcar-leida`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
        setNoLeidas((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const marcarTodasLeidas = async () => {
    try {
      const response = await fetch("/api/notificaciones/marcar-todas-leidas", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
        setNoLeidas(0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case "NUEVA_SOLICITUD":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "SOLICITUD_APROBADA":
        return <Check className="h-4 w-4 text-green-600" />
      case "SOLICITUD_RECHAZADA":
        return <X className="h-4 w-4 text-red-600" />
      case "ASIGNACION_FICHA":
        return <Badge className="h-4 w-4 text-purple-600" />
      case "RECORDATORIO":
        return <Clock className="h-4 w-4 text-amber-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationColor = (tipo: string) => {
    switch (tipo) {
      case "NUEVA_SOLICITUD":
        return "border-l-blue-500"
      case "SOLICITUD_APROBADA":
        return "border-l-green-500"
      case "SOLICITUD_RECHAZADA":
        return "border-l-red-500"
      case "ASIGNACION_FICHA":
        return "border-l-purple-500"
      case "RECORDATORIO":
        return "border-l-amber-500"
      default:
        return "border-l-gray-500"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end">
      <div className="bg-white w-96 h-full shadow-xl">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notificaciones</span>
                {noLeidas > 0 && <Badge className="bg-red-500 text-white">{noLeidas}</Badge>}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {noLeidas > 0 && (
              <Button variant="outline" size="sm" onClick={marcarTodasLeidas} className="w-full bg-transparent">
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)]">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Cargando notificaciones...</p>
                </div>
              ) : notificaciones.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay notificaciones</h3>
                  <p className="text-gray-600">Te notificaremos cuando haya actualizaciones importantes.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notificaciones.map((notificacion) => (
                    <div
                      key={notificacion.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${getNotificationColor(notificacion.tipo)} ${
                        !notificacion.leida ? "bg-blue-50" : ""
                      }`}
                      onClick={() => !notificacion.leida && marcarComoLeida(notificacion.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notificacion.tipo)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-sm font-medium ${
                                !notificacion.leida ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {notificacion.titulo}
                            </h4>
                            {!notificacion.leida && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          </div>
                          <p className={`text-sm mt-1 ${!notificacion.leida ? "text-gray-800" : "text-gray-600"}`}>
                            {notificacion.mensaje}
                          </p>
                          {notificacion.solicitud && (
                            <p className="text-xs text-gray-500 mt-1">
                              {notificacion.solicitud.codigo} - {notificacion.solicitud.programa.nombre}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {format(new Date(notificacion.fechaCreada), "PPp", { locale: es })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
