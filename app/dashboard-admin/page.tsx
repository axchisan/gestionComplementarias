import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-2">
              Panel de control completo para la gestión del sistema de formación complementaria.
            </p>
          </div>
          <AdminDashboard />
        </div>
      </div>
      <Footer />
    </div>
  )
}
