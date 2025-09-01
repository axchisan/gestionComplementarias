import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SolicitudForm } from "@/components/solicitud-form"

export default function NuevaSolicitudPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Nueva Solicitud de Formación Complementaria</h1>
            <p className="text-gray-600 mt-2">
              Complete el formulario para crear una nueva ficha de caracterización y solicitud de formación.
            </p>
          </div>
          <SolicitudForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
