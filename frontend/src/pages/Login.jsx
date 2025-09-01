"use client"

import { useState } from "react"
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from "lucide-react"
import { authService } from "../services/authService"
import toast from "react-hot-toast"

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await authService.login(formData.email, formData.password, formData.remember)
      toast.success(`¡Bienvenido, ${user.name}!`)
      onLogin(user)
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const demoUsers = [
    {
      email: "instructor@sena.edu.co",
      role: "Instructor",
      password: "123456",
      description: "Crear y gestionar fichas de formación",
    },
    {
      email: "coordinador@sena.edu.co",
      role: "Coordinador",
      password: "123456",
      description: "Aprobar fichas y gestionar instructores",
    },
    {
      email: "admin@sena.edu.co",
      role: "Administrador",
      password: "123456",
      description: "Administración completa del sistema",
    },
  ]

  const fillDemoUser = (email, password) => {
    setFormData((prev) => ({ ...prev, email, password }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/assets/sena-logo-192.png"
            alt="SENA Logo"
            className="mx-auto h-20 w-auto mb-4"
            onError={(e) => {
              e.target.style.display = "none"
            }}
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Sistema de Formación Complementaria</p>
        </div>

        {/* Demo Users Card */}
        <div className="card-sena mb-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />
            Usuarios de Demostración
          </h3>
          <div className="space-y-2">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => fillDemoUser(user.email, user.password)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-green-700">{user.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.password}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="card-sena">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="label-sena">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-sena"
                placeholder="tu.email@sena.edu.co"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-sena">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-sena pr-12"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Recordarme
                </label>
              </div>

              <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-sena disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Necesitas ayuda?{" "}
              <a href="mailto:soporte@sena.edu.co" className="font-medium text-green-600 hover:text-green-500">
                Contacta Soporte Técnico
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
