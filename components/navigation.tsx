"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, User, FileText, BarChart3, Home, LogOut, Users, Settings, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const getNavItemsByRole = (role: string) => {
    const baseItems = [{ href: "/", label: "Inicio", icon: Home }]

    if (role === "INSTRUCTOR") {
      return [
        ...baseItems,
        { href: "/mis-solicitudes", label: "Mis Solicitudes", icon: FileText },
        { href: "/nueva-solicitud", label: "Nueva Solicitud", icon: FileText },
        { href: "/mi-perfil", label: "Mi Perfil", icon: User },
      ]
    }

    if (role === "COORDINADOR") {
      return [
        ...baseItems,
        { href: "/solicitudes-pendientes", label: "Solicitudes Pendientes", icon: CheckCircle },
        { href: "/todas-solicitudes", label: "Todas las Solicitudes", icon: FileText },
        { href: "/reportes-coordinador", label: "Reportes", icon: BarChart3 },
        { href: "/gestion-instructores", label: "Instructores", icon: Users },
      ]
    }

    if (role === "ADMIN") {
      return [
        ...baseItems,
        { href: "/dashboard-admin", label: "Dashboard", icon: BarChart3 },
        { href: "/gestion-usuarios", label: "Gestión de Usuarios", icon: Users },
        { href: "/reportes-admin", label: "Reportes Avanzados", icon: BarChart3 },
        { href: "/configuracion", label: "Configuración", icon: Settings },
      ]
    }

    return baseItems
  }

  const navItems = getNavItemsByRole(user?.role || "")

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "INSTRUCTOR":
        return "Instructor"
      case "COORDINADOR":
        return "Coordinador"
      case "ADMIN":
        return "Administrador"
      default:
        return "Usuario"
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/sena-logo.png" alt="SENA Logo" width={60} height={60} className="h-12 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-green-700">SENA</h1>
              <p className="text-xs text-green-600">Centro de Gestión Agroempresarial</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated &&
              navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-green-50"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <div className="text-sm">
                    <div className="font-medium">{user?.name || "Usuario"}</div>
                    <div className="text-xs text-gray-500">{getRoleLabel(user?.role || "")}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Salir
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-green-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated &&
                navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {isAuthenticated ? (
                  <div className="px-3 py-2">
                    <div className="text-sm text-gray-600 mb-2">
                      <div className="font-medium">{user?.name || "Usuario"}</div>
                      <div className="text-xs text-gray-500">{getRoleLabel(user?.role || "")}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-600 border-red-600 bg-transparent"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Salir
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="mx-3 bg-green-600 hover:bg-green-700 text-white">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
