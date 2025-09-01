import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Users, Clock } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sistema de
                <span className="text-green-600 block">Formación</span>
                Complementaria
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Gestiona tus solicitudes de formación complementaria de manera eficiente. Crea fichas de
                caracterización, genera reportes y mantén un historial completo de tus solicitudes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/nueva-solicitud" className="flex items-center space-x-2">
                  <span>Nueva Solicitud</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                <Link href="/solicitudes">Ver Mis Solicitudes</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-green-200">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">150+</div>
                <div className="text-sm text-gray-600">Solicitudes</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">45</div>
                <div className="text-sm text-gray-600">Instructores</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24h</div>
                <div className="text-sm text-gray-600">Respuesta</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-green-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Solicitud #2024-001</h3>
                    <p className="text-sm text-gray-600">Excel Avanzado • 40 horas</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estado</span>
                    <span className="text-green-600 font-medium">Aprobada</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-600">Fecha de inicio</span>
                  <span className="text-sm font-medium text-gray-900">15 Feb 2024</span>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-300 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
