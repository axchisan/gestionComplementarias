const LoadingSpinner = ({ size = "large", text = "Cargando..." }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className={`loading-spinner ${sizeClasses[size]} mx-auto mb-4`}></div>
        <p className="text-gray-600 font-medium">{text}</p>
        <p className="text-sm text-gray-400 mt-2">Sistema SENA - Formación Complementaria</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
