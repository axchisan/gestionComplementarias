import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Panel Izquierdo - Información Institucional */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-8">
                <Image
                  src="/sena-logo.png"
                  alt="SENA Logo"
                  width={80}
                  height={80}
                  
                />
                <div>
                  <h1 className="text-3xl font-bold">SENA</h1>
                  <p className="text-green-100">Servicio Nacional de Aprendizaje</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">Sistema de Formación Complementaria</h2>
                  <p className="text-green-100 text-lg leading-relaxed">
                    Gestiona tus solicitudes de formación de manera eficiente y mantén un seguimiento completo de tu
                    desarrollo profesional.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Solicitudes digitales rápidas y seguras</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Seguimiento en tiempo real del estado</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Reportes automáticos y exportación</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-green-100">Compatible con dispositivos móviles</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-green-500/30">
                  <p className="text-sm text-green-200">
                    <strong>Centro de Gestión Agroempresarial del Oriente</strong>
                  </p>
                  <p className="text-xs text-green-300 mt-1">
                    Transformando vidas a través de la educación técnica y tecnológica
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Formulario de Login */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
                <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
              </div>

              <LoginForm />

              {/* Footer Links */}
              <div className="text-center space-y-3 mt-8">
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{" "}
                  <Link href="/registro" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                    Solicitar acceso
                  </Link>
                </p>
                <p className="text-xs text-gray-500">
                  ¿Problemas para acceder?{" "}
                  <Link href="/soporte" className="text-green-600 hover:text-green-500 transition-colors">
                    Contactar soporte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Institucional */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <p className="text-xs text-gray-500">
              © 2025 SENA - Servicio Nacional de Aprendizaje. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <Link href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">
                Términos de Uso
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">
                Ayuda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
