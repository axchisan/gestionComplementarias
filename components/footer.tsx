import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8">
          {/* Brand y Descripción */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/sena-logo.png"
                alt="SENA Logo"
                width={48}
                height={48}
                className="h-12 w-auto brightness-0 invert"
              />
              <div>
                <h3 className="text-xl font-bold">SENA</h3>
                <p className="text-sm text-gray-400">Centro de Gestión Agroempresarial del Oriente</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sistema integral de gestión de solicitudes de formación complementaria. Facilitamos el proceso de
              solicitud, revisión y aprobación de cursos para instructores del SENA, promoviendo la excelencia educativa
              y el desarrollo profesional continuo.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">Sistema</h4>
            <ul className="space-y-3">
              {[
                { text: "Nueva Solicitud", href: "/nueva-solicitud" },
                { text: "Mis Solicitudes", href: "/solicitudes" },
                { text: "Reportes", href: "/reportes" },
                { text: "Mi Perfil", href: "/perfil" },
                { text: "Ayuda", href: "/ayuda" },
                { text: "Tutoriales", href: "/tutoriales" },
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">Recursos</h4>
            <ul className="space-y-3">
              {[
                "Manual de Usuario",
                "Preguntas Frecuentes",
                "Políticas del Sistema",
                "Términos de Uso",
                "Guías de Formación",
                "Contactar Soporte",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto y Horarios */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p className="font-medium text-white">Sede Principal</p>
                  <p>Centro de Gestión Agroempresarial</p>
                  <p>del Oriente - SENA</p>
                  <p>Colombia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium">+57 (1) 546 1500</p>
                  <p className="text-gray-400">Lun - Vie: 8:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium">formacion@sena.edu.co</p>
                  <p className="text-gray-400">Respuesta en 24 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Estadísticas */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">500+</div>
              <div className="text-sm text-gray-400">Solicitudes Procesadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">150+</div>
              <div className="text-sm text-gray-400">Instructores Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">8</div>
              <div className="text-sm text-gray-400">Centros Conectados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">95%</div>
              <div className="text-sm text-gray-400">Satisfacción</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-sm text-gray-400 text-center lg:text-left">
              <p>© 2024 SENA - Servicio Nacional de Aprendizaje.</p>
              <p>Centro de Gestión Agroempresarial del Oriente. Todos los derechos reservados.</p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Términos de Uso
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Accesibilidad
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Mapa del Sitio
              </Link>
            </div>
          </div>

          {/* Versión del Sistema */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Sistema de Formación Complementaria v2.1.0 |<span className="text-green-400 ml-1">Estado: Operativo</span>{" "}
              |<span className="ml-1">Última actualización: Enero 2024</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
