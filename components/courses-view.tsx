"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, Users, Star, MapPin, Calendar } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Desarrollo de Aplicaciones Web",
    description: "Aprende a crear aplicaciones web modernas con HTML, CSS, JavaScript y frameworks actuales.",
    category: "Tecnología",
    level: "Técnico",
    duration: "6 meses",
    modality: "Presencial",
    location: "Bogotá",
    students: 45,
    rating: 4.8,
    startDate: "2024-02-15",
    instructor: "Ing. María González",
    price: "Gratuito",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Gestión de Bases de Datos",
    description: "Domina el diseño, implementación y administración de bases de datos relacionales y NoSQL.",
    category: "Tecnología",
    level: "Tecnólogo",
    duration: "8 meses",
    modality: "Virtual",
    location: "Nacional",
    students: 32,
    rating: 4.7,
    startDate: "2024-03-01",
    instructor: "Ing. Carlos Rodríguez",
    price: "Gratuito",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Cocina Internacional",
    description: "Técnicas culinarias de diferentes culturas y preparación de platos internacionales.",
    category: "Gastronomía",
    level: "Técnico",
    duration: "4 meses",
    modality: "Presencial",
    location: "Medellín",
    students: 28,
    rating: 4.9,
    startDate: "2024-02-20",
    instructor: "Chef Ana Martínez",
    price: "Gratuito",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Marketing Digital",
    description: "Estrategias de marketing en redes sociales, SEO, SEM y analítica web.",
    category: "Marketing",
    level: "Técnico",
    duration: "5 meses",
    modality: "Mixta",
    location: "Cali",
    students: 38,
    rating: 4.6,
    startDate: "2024-03-10",
    instructor: "Lic. Pedro Jiménez",
    price: "Gratuito",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Soldadura Industrial",
    description: "Técnicas de soldadura para la industria metalmecánica y construcción.",
    category: "Industria",
    level: "Técnico",
    duration: "3 meses",
    modality: "Presencial",
    location: "Barranquilla",
    students: 25,
    rating: 4.8,
    startDate: "2024-02-25",
    instructor: "Téc. Luis Herrera",
    price: "Gratuito",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Diseño Gráfico Digital",
    description: "Creación de piezas gráficas usando herramientas digitales profesionales.",
    category: "Diseño",
    level: "Técnico",
    duration: "6 meses",
    modality: "Presencial",
    location: "Bucaramanga",
    students: 35,
    rating: 4.5,
    startDate: "2024-03-05",
    instructor: "Dis. Laura Vega",
    price: "Gratuito",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const categories = ["Todas", "Tecnología", "Gastronomía", "Marketing", "Industria", "Diseño"]
const levels = ["Todos", "Técnico", "Tecnólogo"]
const modalities = ["Todas", "Presencial", "Virtual", "Mixta"]

export function CoursesView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedLevel, setSelectedLevel] = useState("Todos")
  const [selectedModality, setSelectedModality] = useState("Todas")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "Todos" || course.level === selectedLevel
    const matchesModality = selectedModality === "Todas" || course.modality === selectedModality

    return matchesSearch && matchesCategory && matchesLevel && matchesModality
  })

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Catálogo de Cursos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestra amplia oferta de programas de formación profesional y encuentra el curso perfecto para tu
            desarrollo profesional.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Modality Filter */}
            <Select value={selectedModality} onValueChange={setSelectedModality}>
              <SelectTrigger>
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                {modalities.map((modality) => (
                  <SelectItem key={modality} value={modality}>
                    {modality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredCourses.length} de {courses.length} cursos
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-600 hover:bg-green-700 text-white">{course.category}</Badge>
                  <Badge variant="secondary" className="bg-white/90 text-gray-700">
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600 text-white">{course.price}</Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-gray-900 group-hover:text-green-600 transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2">{course.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Course Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students} estudiantes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{course.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{course.modality}</span>
                  </div>
                </div>

                {/* Rating and Instructor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">Inicio: {course.startDate}</span>
                  </div>
                  <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">Inscribirse</Button>
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    Ver Más
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron cursos</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar los filtros o términos de búsqueda</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("Todas")
                setSelectedLevel("Todos")
                setSelectedModality("Todas")
              }}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
