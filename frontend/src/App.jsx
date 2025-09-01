"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

// Layout Components
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import LoadingSpinner from "./components/common/LoadingSpinner"

// Auth Pages
import Login from "./pages/auth/Login"

// Instructor Pages
import InstructorDashboard from "./pages/instructor/Dashboard"
import InstructorProfile from "./pages/instructor/Profile"
import CreateFicha from "./pages/instructor/CreateFicha"
import MyFichas from "./pages/instructor/MyFichas"

// Coordinador Pages
import CoordinadorDashboard from "./pages/coordinador/Dashboard"
import CoordinadorProfile from "./pages/coordinador/Profile"
import ManageInstructors from "./pages/coordinador/ManageInstructors"
import ReviewFichas from "./pages/coordinador/ReviewFichas"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"
import AdminUsers from "./pages/admin/Users"
import AdminReports from "./pages/admin/Reports"
import AdminSettings from "./pages/admin/Settings"

// Services
import { authService } from "./services/authService"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error al inicializar autenticación:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header user={user} onLogout={handleLogout} />

        <main className="flex-1">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login onLogin={handleLogin} />} />

            {/* Rutas protegidas por rol */}
            {user ? (
              <>
                {/* Rutas de Instructor */}
                {user.role === "instructor" && (
                  <>
                    <Route path="/instructor" element={<InstructorDashboard user={user} />} />
                    <Route path="/instructor/profile" element={<InstructorProfile user={user} />} />
                    <Route path="/instructor/create-ficha" element={<CreateFicha user={user} />} />
                    <Route path="/instructor/my-fichas" element={<MyFichas user={user} />} />
                  </>
                )}

                {/* Rutas de Coordinador */}
                {user.role === "coordinador" && (
                  <>
                    <Route path="/coordinador" element={<CoordinadorDashboard user={user} />} />
                    <Route path="/coordinador/profile" element={<CoordinadorProfile user={user} />} />
                    <Route path="/coordinador/instructors" element={<ManageInstructors user={user} />} />
                    <Route path="/coordinador/review-fichas" element={<ReviewFichas user={user} />} />
                  </>
                )}

                {/* Rutas de Admin */}
                {user.role === "admin" && (
                  <>
                    <Route path="/admin" element={<AdminDashboard user={user} />} />
                    <Route path="/admin/users" element={<AdminUsers user={user} />} />
                    <Route path="/admin/reports" element={<AdminReports user={user} />} />
                    <Route path="/admin/settings" element={<AdminSettings user={user} />} />
                  </>
                )}

                {/* Redirección por defecto según rol */}
                <Route path="/" element={<Navigate to={`/${user.role}`} />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to={user ? `/${user.role}` : "/login"} />} />
          </Routes>
        </main>

        <Footer />

        {/* Notificaciones Toast */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#16a34a",
              },
            },
            error: {
              style: {
                background: "#dc2626",
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
