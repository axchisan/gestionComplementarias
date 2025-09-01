import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CoordinadorDashboard } from "@/components/coordinador-dashboard"

export default function DashboardCoordinadorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CoordinadorDashboard />
        </div>
      </div>
      <Footer />
    </div>
  )
}
