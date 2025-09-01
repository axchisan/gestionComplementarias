"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { User, Mail, Phone, Calendar, MapPin, BookOpen, Download, FileText, Eye } from "lucide-react"
import toast from "react-hot-toast"

import { authService } from "../../services/authService"
import { fichaService } from "../../services/fichaService"
import Modal from "../../components/common/Modal"

const InstructorProfile = ({ user }) => {
  const [loading, setLoading] = useState(false)
  const [fichas, setFichas] = useState([])
  const [selectedFicha, setSelectedFicha] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: user,
  })

  useEffect(() => {
    loadFichas()
  }, [])

  const loadFichas = async () => {
    try {
      const fichasData = await fichaService.getFichasByInstructor(user.id)
      setFichas(fichasData)
    } catch (error) {
      console.error("Error al cargar fichas:", error)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.updateProfile(user.id, data)
      toast.success("Perfil actualizado correctamente")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async (fichaId) => {
    try {
      await fichaService.downloadPDF(fichaId)
      toast.success("PDF descargado correctamente")
    } catch (error) {
      toast.error("Error al descargar PDF")
    }
  }

  const handleDownloadExcel = async (fichaId) => {
    try {
      await fichaService.downloadExcel(fichaId)
      toast.success("Excel descargado correctamente")
    } catch (error) {
      toast.error("Error al descargar Excel")
    }
  }

  const viewFichaDetails = (ficha) => {
    setSelectedFicha(ficha)
    setShowModal(true)
  }

  const tabs = [
    { id: "profile", name: "Mi Perfil", icon: User },
    { id: "fichas", name: "Mis Fichas", icon: FileText },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y revisa tus fichas</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="card-sena">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
            <p className="text-sm text-gray-500">Actualiza tu información de contacto y datos profesionales</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                <input {...register("cedula")} className="input-sena" placeholder="12345678" disabled />
              </div>

              {/* Centro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Formación</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register("centro")}
                    className="input-sena pl-10"
                    placeholder="Centro de formación"
                    disabled
                  />
                </div>
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input {...register("especialidad")} className="input-sena pl-10" placeholder="Especialidad" />
                </div>
              </div>
            </div>

            {/* Fecha de Ingreso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input {...register("fechaIngreso")} type="date" className="input-sena pl-10" disabled />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="btn-sena">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fichas Tab */}
      {activeTab === "fichas" && (
        <div className="card-sena">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mis Fichas de Caracterización</h3>
            <p className="text-sm text-gray-500">Descarga y revisa todas tus fichas aprobadas</p>
          </div>

          <div className="p-6">
            {fichas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Programa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ficha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fichas.map((ficha) => (
                      <tr key={ficha.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{ficha.programa}</div>
                          <div className="text-sm text-gray-500">{ficha.numeroAprendices} aprendices</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ficha.numeroFicha}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge-${ficha.estado}`}>
                            {ficha.estado === "approved" && "Aprobada"}
                            {ficha.estado === "pending" && "Pendiente"}
                            {ficha.estado === "rejected" && "Rechazada"}
                            {ficha.estado === "draft" && "Borrador"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ficha.fechaCreacion).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => viewFichaDetails(ficha)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {ficha.estado === "approved" && (
                            <>
                              <button
                                onClick={() => handleDownloadPDF(ficha.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Descargar PDF"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadExcel(ficha.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Descargar Excel"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes fichas creadas</h3>
                <p className="text-gray-500">Las fichas que crees aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal para detalles de ficha */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Detalles de la Ficha">
        {selectedFicha && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Programa</label>
                <p className="text-sm text-gray-900">{selectedFicha.programa}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Ficha</label>
                <p className="text-sm text-gray-900">{selectedFicha.numeroFicha}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Aprendices</label>
                <p className="text-sm text-gray-900">{selectedFicha.numeroAprendices}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <span className={`badge-${selectedFicha.estado}`}>
                  {selectedFicha.estado === "approved" && "Aprobada"}
                  {selectedFicha.estado === "pending" && "Pendiente"}
                  {selectedFicha.estado === "rejected" && "Rechazada"}
                  {selectedFicha.estado === "draft" && "Borrador"}
                </span>
              </div>
            </div>
            {selectedFicha.observaciones && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedFicha.observaciones}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default InstructorProfile
