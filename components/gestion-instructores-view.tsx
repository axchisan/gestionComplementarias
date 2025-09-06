"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Mail,
  Phone,
  Award as IdCard,
  Building,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Instructor {
  id: string
  name: string
  email: string
  cedula: string
  telefono?: string
  especialidad?: string
  isActive: boolean
  role: string
  createdAt: string
  centro: {
    nombre: string
  }
  estadisticas?: {
    totalSolicitudes: number
    solicitudesAprobadas: number
    tasaAprobacion: number
    totalAprendices: number
    solicitudesPendientes: number
  }
}

interface NewInstructor {
  name: string
  email: string
  cedula: string
  telefono: string
  especialidad: string
  password: string
}

export function GestionInstructoresView() {
  const { token, user } = useAuth()
  const [instructores, setInstructores] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [newInstructor, setNewInstructor] = useState<NewInstructor>({
    name: "",
    email: "",
    cedula: "",
    telefono: "",
    especialidad: "",
    password: "",
  })

  useEffect(() => {
    if (token) {
      loadInstructores()
    }
  }, [token])

  const loadInstructores = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/instructores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInstructores(data.instructores || [])
      }
    } catch (error) {
      console.error("Error loading instructores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInstructor = async () => {
    try {
      const response = await fetch("/api/instructores", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInstructor),
      })

      if (response.ok) {
        await loadInstructores()
        setShowCreateForm(false)
        setNewInstructor({
          name: "",
          email: "",
          cedula: "",
          telefono: "",
          especialidad: "",
          password: "",
        })
      }
    } catch (error) {
      console.error("Error creating instructor:", error)
    }
  }

  const handleUpdateInstructor = async () => {
    if (!editingInstructor) return

    try {
      const response = await fetch(`/api/instructores/${editingInstructor.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingInstructor.name,
          email: editingInstructor.email,
          telefono: editingInstructor.telefono,
          especialidad: editingInstructor.especialidad,
          isActive: editingInstructor.isActive,
        }),
      })

      if (response.ok) {
        await loadInstructores()
        setEditingInstructor(null)
      }
    } catch (error) {
      console.error("Error updating instructor:", error)
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/instructores/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        await loadInstructores()
      }
    } catch (error) {
      console.error("Error toggling instructor status:", error)
    }
  }

  const handleDeleteInstructor = async (id: string) => {
    try {
      const response = await fetch(`/api/instructores/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await loadInstructores()
      }
    } catch (error) {
      console.error("Error deleting instructor:", error)
    }
  }

  const filteredInstructores = instructores.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.cedula.includes(searchTerm),
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando instructores...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{instructores.length}</div>
            <div className="text-sm text-gray-600">Total Instructores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{instructores.filter((i) => i.isActive).length}</div>
            <div className="text-sm text-gray-600">Activos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{instructores.filter((i) => !i.isActive).length}</div>
            <div className="text-sm text-gray-600">Inactivos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {instructores.reduce((sum, i) => sum + (i.estadisticas?.totalSolicitudes || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Solicitudes</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Instructor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Instructor</DialogTitle>
                  <DialogDescription>Complete la información para crear un nuevo instructor</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={newInstructor.name}
                      onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                      placeholder="Nombre completo del instructor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newInstructor.email}
                      onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                      placeholder="correo@sena.edu.co"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input
                      id="cedula"
                      value={newInstructor.cedula}
                      onChange={(e) => setNewInstructor({ ...newInstructor, cedula: e.target.value })}
                      placeholder="Número de cédula"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={newInstructor.telefono}
                      onChange={(e) => setNewInstructor({ ...newInstructor, telefono: e.target.value })}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <Input
                      id="especialidad"
                      value={newInstructor.especialidad}
                      onChange={(e) => setNewInstructor({ ...newInstructor, especialidad: e.target.value })}
                      placeholder="Área de especialidad"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={newInstructor.password}
                        onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
                        placeholder="Contraseña temporal"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleCreateInstructor} className="flex-1">
                      Crear Instructor
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Lista de instructores */}
      <div className="space-y-4">
        {filteredInstructores.map((instructor) => (
          <Card key={instructor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{instructor.name}</h3>
                    <Badge className={instructor.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {instructor.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactivo
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline">{instructor.estadisticas?.totalSolicitudes || 0} solicitudes</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{instructor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IdCard className="h-4 w-4" />
                      <span>C.C. {instructor.cedula}</span>
                    </div>
                    {instructor.telefono && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{instructor.telefono}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{instructor.centro.nombre}</span>
                    </div>
                  </div>

                  {instructor.especialidad && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Especialidad: </span>
                      <span className="text-sm font-medium text-gray-700">{instructor.especialidad}</span>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-gray-500">
                    Registrado el {format(new Date(instructor.createdAt), "PPP", { locale: es })}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Dialog
                    open={editingInstructor?.id === instructor.id}
                    onOpenChange={(open) => !open && setEditingInstructor(null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingInstructor(instructor)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Editar Instructor</DialogTitle>
                        <DialogDescription>Modifique la información del instructor</DialogDescription>
                      </DialogHeader>
                      {editingInstructor && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-name">Nombre Completo</Label>
                            <Input
                              id="edit-name"
                              value={editingInstructor.name}
                              onChange={(e) => setEditingInstructor({ ...editingInstructor, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editingInstructor.email}
                              onChange={(e) => setEditingInstructor({ ...editingInstructor, email: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-telefono">Teléfono</Label>
                            <Input
                              id="edit-telefono"
                              value={editingInstructor.telefono || ""}
                              onChange={(e) => setEditingInstructor({ ...editingInstructor, telefono: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-especialidad">Especialidad</Label>
                            <Input
                              id="edit-especialidad"
                              value={editingInstructor.especialidad || ""}
                              onChange={(e) =>
                                setEditingInstructor({ ...editingInstructor, especialidad: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-status">Estado</Label>
                            <Select
                              value={editingInstructor.isActive ? "active" : "inactive"}
                              onValueChange={(value) =>
                                setEditingInstructor({ ...editingInstructor, isActive: value === "active" })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Activo</SelectItem>
                                <SelectItem value="inactive">Inactivo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex space-x-2 pt-4">
                            <Button onClick={handleUpdateInstructor} className="flex-1">
                              Guardar Cambios
                            </Button>
                            <Button variant="outline" onClick={() => setEditingInstructor(null)} className="flex-1">
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(instructor.id, instructor.isActive)}
                    className={
                      instructor.isActive
                        ? "border-red-600 text-red-600 hover:bg-red-50"
                        : "border-green-600 text-green-600 hover:bg-green-50"
                    }
                  >
                    {instructor.isActive ? (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activar
                      </>
                    )}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar instructor?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente el instructor {instructor.name}{" "}
                          y todas sus solicitudes asociadas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteInstructor(instructor.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInstructores.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron instructores</h3>
            <p className="text-gray-600">
              {searchTerm
                ? "No hay instructores que coincidan con tu búsqueda."
                : "No hay instructores registrados en este centro."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
