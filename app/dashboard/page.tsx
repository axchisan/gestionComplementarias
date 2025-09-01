import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DashboardView } from "@/components/dashboard-view"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <DashboardView />
      <Footer />
    </div>
  )
}
