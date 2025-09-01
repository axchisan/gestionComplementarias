"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  User,
  UserPlus,
  ClipboardCheck,
  TrendingUp,
  Building,
} from "lucide-react"

import { fichaService } from "../../services/fichaService"
import { authService } from "../../services/authService"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const CoordinadorDashboard = ({ user }) => {
  const [stats, setStats] = useState(null)
  const [pendingFichas, setPendingFichas] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, fichasData, instructorsData] = await Promise.all([
          fichaService.getCoordinadorStats(user.centro),
          fichaService.getPendingFichas(user.centro, 5),
          authService.getInstructorsByCentro(user.centro),
        ])
        setStats(statsData)
        setPendingFichas(fichasData)
        setInstructors(instructorsData)
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user.centro])

  if (loading) {
    return <LoadingSpinner text="Cargando dashboard..." />
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  const quickActions = [
    {
      title: "Mi Perfil",
      description: "Ver y editar información personal",
      icon: User,
      href: "/coordinador/profile",
    },
    {
      title: "Gestionar Instructores",
      description: "Crear y administrar cuentas de instructores",
      icon: UserPlus,
      href: "/coordinador/instructors",
    },
    {
      title: "Revisar Fichas",
      description: "Aprobar o rechazar fichas pendientes",
      icon: ClipboardCheck,
      href: "/coordinador/review-fichas",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {user.name}
            </h1>
            <p className="text-lg text-gray-600 mb-3">Panel de Control - Coordinador</p>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-medium text-gray-700">Centro:</span>
              <span className="text-gray-600">{user.centro}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fichas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalFichas}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingFichas}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.approvedFichas}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.rejectedFichas}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Instructores</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalInstructors}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-green-200 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fichas Pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Fichas Pendientes</h3>
                <Link
                  to="/coordinador/review-fichas"
                  className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center space-x-1"
                >
                  <span>Ver todas</span>
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {pendingFichas.length > 0 ? (
                <div className="space-y-4">
                  {pendingFichas.map((ficha) => (
                    <div
                      key={ficha.id}
                      className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100 hover:border-yellow-200 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{ficha.programa}</h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded font-mono">Ficha: {ficha.numeroFicha}</span>
                          <span>Instructor: {ficha.instructor}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className="badge-pending">Pendiente</span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(ficha.fechaCreacion).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No hay fichas pendientes</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructores del Centro */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Instructores del Centro</h3>
                <Link
                  to="/coordinador/instructors"
                  className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center space-x-1"
                >
                  <span>Ver todos</span>
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="p-6">
              {instructors.length > 0 ? (
                <div className="space-y-4">
                  {instructors.slice(0, 5).map((instructor) => (
                    <div
                      key={instructor.id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{instructor.name}</p>
                        <p className="text-sm text-gray-600 truncate">{instructor.especialidad}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {instructor.totalFichas || 0} fichas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">No hay instructores registrados</p>
                  <Link
                    to="/coordinador/instructors"
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Registrar primer instructor</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoordinadorDashboard
