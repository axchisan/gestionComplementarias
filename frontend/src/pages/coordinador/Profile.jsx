"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { User, Mail, Phone, Calendar, MapPin, Save } from "lucide-react"
import toast from "react-hot-toast"

import { authService } from "../../services/authService"

const CoordinadorProfile = ({ user }) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  })

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal como coordinador</p>
      </div>

      {/* Profile Form */}
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
              <input {...register("cedula")} className="input-sena bg-gray-50" placeholder="12345678" disabled />
            </div>

            {/* Centro */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Formación</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  {...register("centro")}
                  className="input-sena pl-10 bg-gray-50"
                  placeholder="Centro de formación"
                  disabled
                />
              </div>
            </div>

            {/* Fecha de Ingreso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input {...register("fechaIngreso")} type="date" className="input-sena pl-10 bg-gray-50" disabled />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="btn-sena flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{loading ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CoordinadorProfile
