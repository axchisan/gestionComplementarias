"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react"
import toast from "react-hot-toast"

import { authService } from "../../services/authService"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await authService.login(data.email, data.password, data.remember)
      toast.success(`¡Bienvenido, ${user.name}!`)
      onLogin(user)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const demoUsers = [
    { email: "instructor@sena.edu.co", role: "Instructor", name: "Carlos Rodríguez" },
    { email: "coordinador@sena.edu.co", role: "Coordinador", name: "María González" },
    { email: "admin@sena.edu.co", role: "Administrador", name: "Ana Martínez" },
  ]

  const fillDemoUser = (email) => {
    const form = document.querySelector("form")
    form.email.value = email
    form.password.value = "123456"
  }

  if (loading) {
    return <LoadingSpinner text="Iniciando sesión..." />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img
            src="/assets/sena-logo-192.png"
            alt="SENA Logo"
            className="mx-auto h-20 w-auto"
            onError={(e) => {
              e.target.style.display = "none"
            }}
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600">Sistema de Formación Complementaria</p>
        </div>

        {/* Demo Users */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Usuarios de Demostración:</h3>
          <div className="space-y-2">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillDemoUser(user.email)}
                className="w-full text-left px-3 py-2 text-xs bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-900">{user.name}</div>
                <div className="text-blue-600">
                  {user.email} - {user.role}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Contraseña para todos: <strong>123456</strong>
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("email", {
                    required: "El correo electrónico es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido",
                    },
                  })}
                  type="email"
                  className={`input-sena pl-10 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="usuario@sena.edu.co"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`input-sena pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              {...register("remember")}
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Recordar sesión
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-sena w-full flex items-center justify-center space-x-2"
          >
            <LogIn className="h-5 w-5" />
            <span>Iniciar Sesión</span>
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            ¿Problemas para acceder?{" "}
            <a href="#" className="text-green-600 hover:text-green-500">
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
