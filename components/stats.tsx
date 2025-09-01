import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Award, Building, MapPin, Briefcase } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "9.5M+",
    label: "Colombianos Formados",
    description: "Desde nuestra fundación",
  },
  {
    icon: Building,
    value: "117",
    label: "Centros de Formación",
    description: "En todo el territorio nacional",
  },
  {
    icon: Award,
    value: "500+",
    label: "Programas Activos",
    description: "Técnicos y tecnológicos",
  },
  {
    icon: Briefcase,
    value: "85%",
    label: "Empleabilidad",
    description: "De nuestros egresados",
  },
  {
    icon: MapPin,
    value: "32",
    label: "Departamentos",
    description: "Con presencia SENA",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Satisfacción",
    description: "De estudiantes y empresas",
  },
]

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Impacto y Resultados</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 60 años transformando vidas y contribuyendo al desarrollo económico y social de Colombia.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-lg font-semibold text-green-600">{stat.label}</div>
                    <div className="text-sm text-gray-600">{stat.description}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Listo para ser parte de esta historia de éxito?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Únete a millones de colombianos que han transformado sus vidas a través de la formación profesional integral
            del SENA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Inscríbete Ahora
            </button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors">
              Conoce Más
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
