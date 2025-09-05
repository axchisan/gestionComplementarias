import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SolicitudDetails } from "@/components/solicitud-details"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SolicitudDetailsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SolicitudDetails solicitudId={id} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
