import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactView } from "@/components/contact-view"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ContactView />
      <Footer />
    </div>
  )
}
