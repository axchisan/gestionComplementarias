import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CrearCredencialesForm } from "@/components/crear-credenciales-form"

export default function CrearCredencialesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crear Credenciales de Acceso</h1>
            <p className="text-gray-600 mt-2">
              Crea credenciales de acceso al sistema para los instructores de tu centro.
            </p>
          </div>
          <CrearCredencialesForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
