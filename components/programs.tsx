import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, ArrowRight } from "lucide-react"

const programs = [
  {
    id: 1,
    title: "Tecnología en Desarrollo de Software",
    description: "Aprende a desarrollar aplicaciones web y móviles con las últimas tecnologías del mercado.",
    duration: "2 años",
    students: "1,200",
    rating: 4.8,
    level: "Tecnólogo",
    category: "Tecnología",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Técnico en Sistemas",
    description: "Formación integral en mantenimiento, instalación y configuración de sistemas informáticos.",
    duration: "18 meses",
    students: "800",
    rating: 4.7,
    level: "Técnico",
    category: "Tecnología",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Tecnología en Gestión Empresarial",
    description: "Desarrolla competencias para liderar procesos administrativos y de gestión en organizaciones.",
    duration: "2 años",
    students: "950",
    rating: 4.6,
    level: "Tecnólogo",
    category: "Administración",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Técnico en Cocina",
    description: "Formación práctica en técnicas culinarias, manipulación de alimentos y gestión gastronómica.",
    duration: "12 meses",
    students: "600",
    rating: 4.9,
    level: "Técnico",
    category: "Gastronomía",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Tecnología en Mecatrónica",
    description: "Integración de sistemas mecánicos, electrónicos y de control para la industria 4.0.",
    duration: "2.5 años",
    students: "400",
    rating: 4.8,
    level: "Tecnólogo",
    category: "Ingeniería",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Técnico en Diseño Gráfico",
    description: "Creatividad y técnica para desarrollar piezas gráficas digitales e impresas.",
    duration: "15 meses",
    students: "700",
    rating: 4.5,
    level: "Técnico",
    category: "Diseño",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function Programs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Programas de Formación</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra amplia oferta educativa diseñada para formar profesionales competentes y preparados para el
            mercado laboral actual.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={program.image || "/placeholder.svg"}
                  alt={program.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600 hover:bg-green-700 text-white">{program.category}</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {program.level}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-gray-900 group-hover:text-green-600 transition-colors">
                  {program.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2">{program.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{program.students} estudiantes</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">{program.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">Excelente</span>
                </div>

                {/* Action Button */}
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white group/btn">
                  <span>Ver Detalles</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
            <a href="/cursos">
              Ver Todos los Programas
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
