"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, LogOut, Home, FileText, Users, Settings, BarChart3 } from "lucide-react"

const Navigation = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const getNavigationItems = () => {
    if (!user) {
      return [
        { name: "Inicio", href: "/", icon: Home },
        { name: "Iniciar Sesión", href: "/login", icon: User },
      ]
    }

    const commonItems = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Soporte", href: "/soporte", icon: Settings },
    ]

    switch (user.role) {
      case "instructor":
        return [
          ...commonItems,
          { name: "Nueva Solicitud", href: "/nueva-solicitud", icon: FileText },
          { name: "Mis Solicitudes", href: "/mis-solicitudes", icon: FileText },
        ]
      case "coordinador":
        return [...commonItems, { name: "Registrar Instructor", href: "/registrar-instructor", icon: Users }]
      case "admin":
        return [
          ...commonItems,
          { name: "Crear Usuario", href: "/crear-usuario", icon: Users },
          { name: "Solicitudes Pendientes", href: "/solicitudes-pendientes", icon: FileText },
          { name: "Reportes", href: "/reportes", icon: BarChart3 },
        ]
      default:
        return commonItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/assets/sena-logo.png"
                alt="SENA Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
              <div className="text-xl font-bold text-green-600">SENA - Formación Complementaria</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {user && (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none focus:text-green-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {user && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 py-2 text-sm text-gray-600">
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={() => {
                    onLogout()
                    setIsOpen(false)
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
