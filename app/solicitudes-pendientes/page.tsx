import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SolicitudesPendientes } from "@/components/solicitudes-pendientes"

export default function SolicitudesPendientesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Solicitudes Pendientes</h1>
            <p className="text-gray-600 mt-2">
              Revisa y gestiona las solicitudes de formación complementaria que requieren tu aprobación.
            </p>
          </div>
          <SolicitudesPendientes />
        </div>
      </div>
      <Footer />
    </div>
  )
}
