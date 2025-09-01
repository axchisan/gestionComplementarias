"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, LogOut, Home, FileText, BarChart3, Settings } from "lucide-react"

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const getNavigationItems = () => {
    if (!user) return []

    const commonItems = [{ name: "Dashboard", href: "/dashboard", icon: Home }]

    switch (user.role) {
      case "instructor":
        return [
          ...commonItems,
          { name: "Crear Ficha", href: "/crear-ficha", icon: FileText },
          { name: "Mi Historial", href: "/historial", icon: BarChart3 },
        ]
      case "coordinador":
        return [
          ...commonItems,
          { name: "Crear Ficha", href: "/crear-ficha", icon: FileText },
          { name: "Historial", href: "/historial", icon: BarChart3 },
          { name: "Gestión", href: "/gestion", icon: Settings },
        ]
      case "admin":
        return [
          ...commonItems,
          { name: "Gestión", href: "/gestion", icon: Settings },
          { name: "Reportes", href: "/reportes", icon: BarChart3 },
        ]
      default:
        return commonItems
    }
  }

  const navigationItems = getNavigationItems()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <img
              src="/assets/sena-logo-192.png"
              alt="SENA Logo"
              className="h-10 w-auto"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-green-600">SENA</h1>
              <p className="text-xs text-gray-600">Formación Complementaria</p>
            </div>
          </Link>

          {/* Navegación desktop */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-green-100 text-green-700 shadow-sm"
                        : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          )}

          {/* Usuario y menú móvil */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Info usuario desktop */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline">Salir</span>
                  </button>
                </div>

                {/* Botón menú móvil */}
                <button
                  onClick={toggleMenu}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-colors"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            )}

            {!user && (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200 py-4 fade-in">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Info usuario móvil */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="px-4 py-2">
                <p className="text-base font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                {user.centro && <p className="text-xs text-gray-400 mt-1">{user.centro}</p>}
              </div>
              <button
                onClick={() => {
                  onLogout()
                  closeMenu()
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
