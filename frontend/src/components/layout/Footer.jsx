const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img
              src="/assets/sena-logo-192.png"
              alt="SENA Logo"
              className="h-8 w-auto"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">SENA</p>
              <p className="text-xs text-gray-500">Servicio Nacional de Aprendizaje</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">Sistema de Formación Complementaria</p>
            <p className="text-xs text-gray-500 mt-1">© 2024 SENA. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
