"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Calendar, User, FileText, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"

interface Solicitud {
  id: string
  codigo: string
  estado: string
  fechaCreacion: string
  fechaInicio: string
  fechaFin: string
  numeroAprendices: number
  modalidad: string
  programa: {
    nombre: string
    codigo: string
  }
  instructor: {
    name: string
    email: string
  }
  numeroFicha?: string
  comentarios?: string
  motivoRechazo?: string
}

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  solicitud: Solicitud | null
  onApprove: (solicitudId: string, numeroFicha: string, comentarios?: string) => Promise<void>
  onReject: (solicitudId: string, motivoRechazo: string) => Promise<void>
}

export function ApprovalModal({ isOpen, onClose, solicitud, onApprove, onReject }: ApprovalModalProps) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [numeroFicha, setNumeroFicha] = useState("")
  const [comentarios, setComentarios] = useState("")
  const [motivoRechazo, setMotivoRechazo] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleClose = () => {
    setAction(null)
    setNumeroFicha("")
    setComentarios("")
    setMotivoRechazo("")
    onClose()
  }

  const handleApprove = async () => {
    if (!solicitud || !numeroFicha.trim()) {
      toast({
        title: "Error",
        description: "El número de ficha es requerido",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onApprove(solicitud.id, numeroFicha.trim(), comentarios.trim() || undefined)
      toast({
        title: "Solicitud Aprobada",
        description: `La solicitud ${solicitud.codigo} ha sido aprobada exitosamente`,
      })
      handleClose()
    } catch (error) {
      console.error("Error approving solicitud:", error)
      toast({
        title: "Error",
        description: "Error al aprobar la solicitud",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!solicitud || !motivoRechazo.trim()) {
      toast({
        title: "Error",
        description: "El motivo de rechazo es requerido",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onReject(solicitud.id, motivoRechazo.trim())
      toast({
        title: "Solicitud Rechazada",
        description: `La solicitud ${solicitud.codigo} ha sido rechazada`,
      })
      handleClose()
    } catch (error) {
      console.error("Error rejecting solicitud:", error)
      toast({
        title: "Error",
        description: "Error al rechazar la solicitud",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateFichaNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    setNumeroFicha(`${year}${random}`)
  }

  if (!solicitud) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Revisar Solicitud - {solicitud.codigo}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la Solicitud */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Información de la Solicitud</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Instructor:</span>
                <span className="font-medium">{solicitud.instructor.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Programa:</span>
                <span className="font-medium">{solicitud.programa.nombre}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Fecha Inicio:</span>
                <span className="font-medium">{new Date(solicitud.fechaInicio).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Fecha Fin:</span>
                <span className="font-medium">{new Date(solicitud.fechaFin).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Aprendices:</span>
                <span className="font-medium">{solicitud.numeroAprendices}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Modalidad:</span>
                <Badge variant="outline">{solicitud.modalidad}</Badge>
              </div>
            </div>
          </div>

          {/* Acciones */}
          {!action && (
            <div className="flex space-x-4">
              <Button
                onClick={() => setAction("approve")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprobar Solicitud
              </Button>
              <Button onClick={() => setAction("reject")} variant="destructive" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar Solicitud
              </Button>
            </div>
          )}

          {/* Formulario de Aprobación */}
          {action === "approve" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium text-green-700">Aprobar Solicitud</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="numeroFicha">Número de Ficha *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="numeroFicha"
                      value={numeroFicha}
                      onChange={(e) => setNumeroFicha(e.target.value)}
                      placeholder="Ej: 20241234"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={generateFichaNumber} size="sm">
                      Generar
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="comentarios">Comentarios (Opcional)</Label>
                  <Textarea
                    id="comentarios"
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Comentarios adicionales sobre la aprobación..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Formulario de Rechazo */}
          {action === "reject" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium text-red-700">Rechazar Solicitud</h3>
              <div>
                <Label htmlFor="motivoRechazo">Motivo de Rechazo *</Label>
                <Textarea
                  id="motivoRechazo"
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Explica el motivo del rechazo..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          {action === "approve" && (
            <Button
              onClick={handleApprove}
              disabled={loading || !numeroFicha.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Aprobando..." : "Confirmar Aprobación"}
            </Button>
          )}
          {action === "reject" && (
            <Button onClick={handleReject} disabled={loading || !motivoRechazo.trim()} variant="destructive">
              {loading ? "Rechazando..." : "Confirmar Rechazo"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
