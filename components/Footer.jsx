import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/assets/sena-logo.png"
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
            <p className="text-gray-300 mb-4">
              Sistema de Gestión de Formación Complementaria para instructores del SENA. Optimizando procesos y
              mejorando la eficiencia en la solicitud de capacitaciones.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.sena.edu.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-green-400 transition-colors">
                  Iniciar Sesión
                </a>
              </li>
              <li>
                <a href="/soporte" className="text-gray-300 hover:text-green-400 transition-colors">
                  Soporte Técnico
                </a>
              </li>
              <li>
                <a
                  href="https://www.sena.edu.co/es-co/Paginas/default.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Portal SENA
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">+57 (1) 546 1500</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">soporte@sena.edu.co</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-green-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  Calle 57 No. 8-69
                  <br />
                  Bogotá D.C., Colombia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 SENA - Servicio Nacional de Aprendizaje. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">
                Términos de Uso
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">
                Accesibilidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
