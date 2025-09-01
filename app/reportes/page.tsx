import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ReportesView } from "@/components/reportes-view"

export default function ReportesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="text-gray-600 mt-2">
              Genera reportes detallados y analiza las estadísticas de tus solicitudes de formación complementaria.
            </p>
          </div>
          <ReportesView />
        </div>
      </div>
      <Footer />
    </div>
  )
}
