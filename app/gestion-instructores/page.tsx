import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GestionInstructoresView } from "@/components/gestion-instructores-view"

export default function GestionInstructoresPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Instructores</h1>
            <p className="text-gray-600 mt-2">
              Administra los instructores de tu centro, crea nuevos usuarios y gestiona sus permisos.
            </p>
          </div>
          <GestionInstructoresView />
        </div>
      </div>
      <Footer />
    </div>
  )
}
