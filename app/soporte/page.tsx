import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SoporteView } from "@/components/soporte-view"

export default function SoportePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Soporte Técnico</h1>
            <p className="text-gray-600 mt-2">¿Tienes problemas para acceder al sistema? Estamos aquí para ayudarte.</p>
          </div>
          <SoporteView />
        </div>
      </div>
      <Footer />
    </div>
  )
}
