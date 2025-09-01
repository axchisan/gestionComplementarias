"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FileText, Plus, BarChart3, Clock, CheckCircle, XCircle, User, Download, TrendingUp } from "lucide-react"

import { fichaService } from "../../services/fichaService"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const InstructorDashboard = ({ user }) => {
  const [stats, setStats] = useState(null)
  const [recentFichas, setRecentFichas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, fichasData] = await Promise.all([
          fichaService.getInstructorStats(user.id),
          fichaService.getRecentFichas(user.id, 5),
        ])
        setStats(statsData)
        setRecentFichas(fichasData)
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user.id])

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
      href: "/instructor/profile",
    },
    {
      title: "Crear Nueva Ficha",
      description: "Solicitar formación complementaria",
      icon: Plus,
      href: "/instructor/create-ficha",
    },
    {
      title: "Mis Fichas",
      description: "Ver todas mis fichas de caracterización",
      icon: BarChart3,
      href: "/instructor/my-fichas",
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
            <p className="text-lg text-gray-600 mb-3">Panel de Control - Instructor</p>
            <div className="flex flex-wrap gap-4 text-sm">
              {user.centro && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Centro:</span>
                  <span className="text-gray-600">{user.centro}</span>
                </div>
              )}
              {user.especialidad && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Especialidad:</span>
                  <span className="text-gray-600">{user.especialidad}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fichas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
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
                  <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
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

        {/* Recent Fichas */}
        {recentFichas.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Fichas Recientes</h2>
                <Link
                  to="/instructor/my-fichas"
                  className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center space-x-1"
                >
                  <span>Ver todas</span>
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Programa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ficha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recentFichas.map((ficha) => (
                    <tr key={ficha.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ficha.programa}</div>
                        <div className="text-sm text-gray-500">{ficha.numeroAprendices} aprendices</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {ficha.numeroFicha}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge-${ficha.estado}`}>
                          {ficha.estado === "approved" && "Aprobada"}
                          {ficha.estado === "pending" && "Pendiente"}
                          {ficha.estado === "rejected" && "Rechazada"}
                          {ficha.estado === "draft" && "Borrador"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ficha.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          {ficha.estado === "approved" && (
                            <button className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50">
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          <Link
                            to={`/instructor/my-fichas/${ficha.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentFichas.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16">
            <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes fichas creadas</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Comienza creando tu primera ficha de caracterización para solicitar formación complementaria
            </p>
            <Link
              to="/instructor/create-ficha"
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Crear Primera Ficha</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard
