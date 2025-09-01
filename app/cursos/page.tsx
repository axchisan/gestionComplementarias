import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CoursesView } from "@/components/courses-view"

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <CoursesView />
      <Footer />
    </div>
  )
}
