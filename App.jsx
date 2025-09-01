"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import NuevaSolicitud from "./pages/NuevaSolicitud"
import MisSolicitudes from "./pages/MisSolicitudes"
import DashboardCoordinador from "./pages/DashboardCoordinador"
import DashboardAdmin from "./pages/DashboardAdmin"
import RegistrarInstructor from "./pages/RegistrarInstructor"
import CrearUsuario from "./pages/CrearUsuario"
import SolicitudesPendientes from "./pages/SolicitudesPendientes"
import Reportes from "./pages/Reportes"
import Soporte from "./pages/Soporte"
import { AuthService } from "./services/AuthService"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    AuthService.logout()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation user={user} onLogout={handleLogout} />

        <main className="flex-1">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />

            {/* Rutas protegidas */}
            {user ? (
              <>
                {/* Rutas para Instructores */}
                {user.role === "instructor" && (
                  <>
                    <Route path="/dashboard" element={<Dashboard user={user} />} />
                    <Route path="/nueva-solicitud" element={<NuevaSolicitud user={user} />} />
                    <Route path="/mis-solicitudes" element={<MisSolicitudes user={user} />} />
                  </>
                )}

                {/* Rutas para Coordinadores */}
                {user.role === "coordinador" && (
                  <>
                    <Route path="/dashboard" element={<DashboardCoordinador user={user} />} />
                    <Route path="/registrar-instructor" element={<RegistrarInstructor user={user} />} />
                  </>
                )}

                {/* Rutas para Administradores */}
                {user.role === "admin" && (
                  <>
                    <Route path="/dashboard" element={<DashboardAdmin user={user} />} />
                    <Route path="/crear-usuario" element={<CrearUsuario user={user} />} />
                    <Route path="/solicitudes-pendientes" element={<SolicitudesPendientes user={user} />} />
                    <Route path="/reportes" element={<Reportes user={user} />} />
                  </>
                )}

                {/* Rutas comunes */}
                <Route path="/soporte" element={<Soporte user={user} />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
