"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { UserPlus, Search, Edit, Trash2, Eye, User, Mail, Phone, BookOpen } from "lucide-react"
import toast from "react-hot-toast"

import { authService } from "../../services/authService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import Modal from "../../components/common/Modal"

const ManageInstructors = ({ user }) => {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalMode, setModalMode] = useState("create") // create, edit, view

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    loadInstructors()
  }, [])

  const loadInstructors = async () => {
    try {
      const instructorsData = await authService.getInstructorsByCentro(user.centro)
      setInstructors(instructorsData)
    } catch (error) {
      console.error("Error al cargar instructores:", error)
      toast.error("Error al cargar instructores")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (modalMode === "create") {
        await authService.createInstructor({
          ...data,
          centro: user.centro,
          role: "instructor",
        })
        toast.success("Instructor creado correctamente")
      } else if (modalMode === "edit") {
        await authService.updateUser(selectedInstructor.id, data)
        toast.success("Instructor actualizado correctamente")
      }

      setShowModal(false)
      reset()
      loadInstructors()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleCreateInstructor = () => {
    setModalMode("create")
    setSelectedInstructor(null)
    reset()
    setShowModal(true)
  }

  const handleEditInstructor = (instructor) => {
    setModalMode("edit")
    setSelectedInstructor(instructor)
    reset(instructor)
    setShowModal(true)
  }

  const handleViewInstructor = (instructor) => {
    setModalMode("view")
    setSelectedInstructor(instructor)
    setShowModal(true)
  }

  const handleDeleteInstructor = async (instructorId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este instructor?")) {
      try {
        await authService.deleteUser(instructorId)
        toast.success("Instructor eliminado correctamente")
        loadInstructors()
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instructor.especialidad && instructor.especialidad.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return <LoadingSpinner text="Cargando instructores..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestionar Instructores</h1>
            <p className="text-gray-600">Administra las cuentas de instructores de tu centro</p>
          </div>
          <button onClick={handleCreateInstructor} className="btn-sena flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Nuevo Instructor</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar instructores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-sena pl-10"
          />
        </div>
      </div>

      {/* Instructors Table */}
      <div className="card-sena">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Instructores ({filteredInstructors.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Ingreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                        <div className="text-sm text-gray-500">ID: {instructor.cedula}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instructor.email}</div>
                    <div className="text-sm text-gray-500">{instructor.telefono}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {instructor.especialidad || "No especificada"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instructor.fechaIngreso ? new Date(instructor.fechaIngreso).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewInstructor(instructor)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditInstructor(instructor)}
                      className="text-green-600 hover:text-green-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInstructor(instructor.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInstructors.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No se encontraron instructores" : "No hay instructores registrados"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando el primer instructor"}
              </p>
              {!searchTerm && (
                <button onClick={handleCreateInstructor} className="btn-sena">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Primer Instructor
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === "create"
            ? "Crear Nuevo Instructor"
            : modalMode === "edit"
              ? "Editar Instructor"
              : "Detalles del Instructor"
        }
      >
        {modalMode === "view" && selectedInstructor ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-sm text-gray-900">{selectedInstructor.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{selectedInstructor.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <p className="text-sm text-gray-900">{selectedInstructor.telefono || "No especificado"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cédula</label>
                <p className="text-sm text-gray-900">{selectedInstructor.cedula}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                <p className="text-sm text-gray-900">{selectedInstructor.especialidad || "No especificada"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
                <p className="text-sm text-gray-900">
                  {selectedInstructor.fechaIngreso
                    ? new Date(selectedInstructor.fechaIngreso).toLocaleDateString()
                    : "No especificada"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register("name", { required: "El nombre es requerido" })}
                    className={`input-sena pl-10 ${errors.name ? "border-red-500" : ""}`}
                    placeholder="Nombre completo"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register("email", {
                      required: "El email es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    type="email"
                    className={`input-sena pl-10 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="correo@sena.edu.co"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input {...register("telefono")} className="input-sena pl-10" placeholder="3001234567" />
                </div>
              </div>

              {/* Cédula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
                <input
                  {...register("cedula", { required: "La cédula es requerida" })}
                  className={`input-sena ${errors.cedula ? "border-red-500" : ""}`}
                  placeholder="12345678"
                />
                {errors.cedula && <p className="mt-1 text-sm text-red-600">{errors.cedula.message}</p>}
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register("especialidad")}
                    className="input-sena pl-10"
                    placeholder="Especialidad del instructor"
                  />
                </div>
              </div>

              {/* Fecha de Ingreso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                <input {...register("fechaIngreso")} type="date" className="input-sena" />
              </div>
            </div>

            {modalMode === "create" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Temporal *</label>
                  <input
                    {...register("password", {
                      required: modalMode === "create" ? "La contraseña es requerida" : false,
                      minLength: {
                        value: 6,
                        message: "La contraseña debe tener al menos 6 caracteres",
                      },
                    })}
                    type="password"
                    className={`input-sena ${errors.password ? "border-red-500" : ""}`}
                    placeholder="Contraseña temporal"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-sena">
                {modalMode === "create" ? "Crear Instructor" : "Actualizar Instructor"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default ManageInstructors
