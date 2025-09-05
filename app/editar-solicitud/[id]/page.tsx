import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { EditarSolicitudForm } from "@/components/editar-solicitud-form"

interface EditarSolicitudPageProps {
  params: {
    id: string
  }
}

export default function EditarSolicitudPage({ params }: EditarSolicitudPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Editar Solicitud de Formación</h1>
            <p className="text-gray-600 mt-2">Modifique los datos de su solicitud de formación complementaria.</p>
          </div>
          <EditarSolicitudForm solicitudId={params.id} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
