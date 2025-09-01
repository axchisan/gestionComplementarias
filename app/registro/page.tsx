import { RegistroForm } from "@/components/registro-form"
import Image from "next/image"
import Link from "next/link"

export default function RegistroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image src="/sena-logo.png" alt="SENA Logo" width={80} height={80} className="h-20 w-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Solicitar Acceso</h2>
          <p className="mt-2 text-sm text-gray-600">Sistema de Formación Complementaria</p>
          <p className="text-xs text-gray-500">Centro de Gestión Agroempresarial del Oriente</p>
        </div>

        {/* Registration Form */}
        <RegistroForm />

        {/* Footer Links */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>

        {/* Institutional Footer */}
        <div className="text-center pt-8 border-t border-green-200 mt-8">
          <p className="text-xs text-gray-500">© 2024 SENA - Servicio Nacional de Aprendizaje</p>
          <p className="text-xs text-gray-400">Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  )
}
