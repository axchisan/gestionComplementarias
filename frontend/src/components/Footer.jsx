import { Mail, Phone, MapPin, ExternalLink, Heart } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/assets/sena-logo-192.png"
                alt="SENA Logo"
                className="h-12 w-auto"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
              <div>
                <h3 className="text-xl font-bold">SENA</h3>
                <p className="text-sm text-gray-300">Servicio Nacional de Aprendizaje</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Sistema de Gestión de Formación Complementaria para instructores del SENA. Optimizando procesos educativos
              y mejorando la eficiencia en la solicitud de capacitaciones especializadas.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.sena.edu.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-gray-700"
                aria-label="Portal oficial del SENA"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/crear-ficha" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Crear Ficha
                </a>
              </li>
              <li>
                <a href="/historial" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  Mi Historial
                </a>
              </li>
              <li>
                <a
                  href="https://www.sena.edu.co/es-co/Paginas/default.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  Portal SENA
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+57 (1) 546 1500</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <a
                  href="mailto:soporte@sena.edu.co"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  soporte@sena.edu.co
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-green-400 flex-shrink-0 mt-1" />
                <div className="text-gray-300 text-sm">
                  <p>Calle 57 No. 8-69</p>
                  <p>Bogotá D.C., Colombia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <span>© {currentYear} SENA - Servicio Nacional de Aprendizaje.</span>
              <span className="hidden md:inline">Todos los derechos reservados.</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <span>Desarrollado con</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>para el SENA</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end space-x-6 mt-4 md:mt-2">
            <a href="#" className="text-gray-400 hover:text-green-400 text-xs transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 text-xs transition-colors">
              Términos de Uso
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 text-xs transition-colors">
              Accesibilidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
