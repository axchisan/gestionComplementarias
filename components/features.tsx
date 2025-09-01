import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BarChart3, Shield, Smartphone, Download, History } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Gestión de Solicitudes",
    description:
      "Crea y gestiona solicitudes de formación complementaria con formularios intuitivos y validación en tiempo real.",
  },
  {
    icon: BarChart3,
    title: "Reportes Automáticos",
    description: "Genera informes en PDF y Excel basados en el formato oficial de solicitud del SENA.",
  },
  {
    icon: History,
    title: "Historial Completo",
    description: "Mantén un registro detallado de todas las solicitudes generadas con búsqueda y filtros avanzados.",
  },
  {
    icon: Shield,
    title: "Sesiones Seguras",
    description: "Sistema de autenticación robusto que garantiza la seguridad de la información de los instructores.",
  },
  {
    icon: Smartphone,
    title: "PWA Compatible",
    description: "Funciona como aplicación nativa en dispositivos móviles y de escritorio con capacidades offline.",
  },
  {
    icon: Download,
    title: "Exportación Flexible",
    description: "Descarga tus solicitudes y reportes en múltiples formatos para facilitar la gestión administrativa.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Características del Sistema</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una plataforma completa diseñada específicamente para las necesidades del Centro de Gestión Agroempresarial
            del Oriente.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Listo para optimizar tu gestión de formación?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Únete a los instructores que ya están utilizando nuestro sistema para gestionar sus solicitudes de formación
            complementaria de manera eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Comenzar Ahora
            </button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors">
              Ver Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
