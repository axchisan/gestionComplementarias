import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SolicitudesList } from "@/components/solicitudes-list"

export default function SolicitudesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mis Solicitudes</h1>
            <p className="text-gray-600 mt-2">
              Gestiona y da seguimiento a todas tus solicitudes de formación complementaria.
            </p>
          </div>
          <SolicitudesList />
        </div>
      </div>
      <Footer />
    </div>
  )
}
