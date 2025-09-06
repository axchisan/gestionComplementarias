"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TodasSolicitudesView } from "@/components/todas-solicitudes-view"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TodasSolicitudesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "COORDINADOR")) {
      router.push("/")
    }
  }, [user, isLoading, router])

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

  if (!user || user.role !== "COORDINADOR") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Todas las Solicitudes</h1>
            <p className="text-gray-600 mt-2">
              Visualiza y gestiona todas las solicitudes de formación complementaria de tu centro.
            </p>
          </div>
          <TodasSolicitudesView />
        </div>
      </div>
      <Footer />
    </div>
  )
}
