"use client"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { AdminDashboard } from "@/components/admin-dashboard"
import { InstructorDashboard } from "@/components/instructor-dashboard"
import { SolicitudesPendientes } from "@/components/solicitudes-pendientes"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario logueado, mostrar landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <Hero />
        <Features />
        <Footer />
      </div>
    )
  }

  // Mostrar dashboard según el rol del usuario
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user.role === "ADMIN" && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
                <p className="text-gray-600 mt-2">
                  Panel de control completo para la gestión del sistema de formación complementaria.
                </p>
              </div>
              <AdminDashboard />
            </>
          )}

          {user.role === "COORDINADOR" && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Panel de Coordinación</h1>
                <p className="text-gray-600 mt-2">
                  Gestiona las solicitudes de formación de tu centro y supervisa el progreso de los instructores.
                </p>
              </div>
              <SolicitudesPendientes />
            </>
          )}

          {user.role === "INSTRUCTOR" && <InstructorDashboard />}
        </div>
      </div>
      <Footer />
    </div>
  )
}
