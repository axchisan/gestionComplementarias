"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FileText, Plus, BarChart3, Clock, CheckCircle, TrendingUp, Users, Calendar } from "lucide-react"
import { fichaService } from "../services/fichaService"
import LoadingSpinner from "../components/LoadingSpinner"

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null)
  const [recentFichas, setRecentFichas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, fichasData] = await Promise.all([
          fichaService.getStats(user.id),
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

  const getStatusBadge = (status) => {
    const badges = {
      draft: "badge-draft",
      pending: "badge-pending",
      approved: "badge-approved",
      rejected: "badge-rejected",
    }
    return badges[status] || "badge-draft"
  }

  const getStatusText = (status) => {
    const texts = {
      draft: "Borrador",
      pending: "Pendiente",
      approved: "Aprobada",
      rejected: "Rechazada",
    }
    return texts[status] || "Desconocido"
  }

  const quickActions = [
    {
      title: "Crear Nueva Ficha",
      description: "Solicitar formación complementaria",
      icon: Plus,
      href: "/crear-ficha",
      color: "bg-green-500 hover:bg-green-600",
      show: user.role === "instructor" || user.role === "coordinador",
    },
    {
      title: "Ver Mi Historial",
      description: "Consultar fichas anteriores",
      icon: BarChart3,
      href: "/historial",
      color: "bg-blue-500 hover:bg-blue-600",
      show: true,
    },
    {
      title: "Gestión",
      description: "Administrar sistema",
      icon: Users,
      href: "/gestion",
      color: "bg-purple-500 hover:bg-purple-600",
      show: user.role === "coordinador" || user.role === "admin",
    },
  ].filter((action) => action.show)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, {user.name}
        </h1>
        <p className="text-gray-600">Bienvenido al Sistema de Formación Complementaria del SENA</p>
        {user.centro && (
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium">Centro:</span> {user.centro}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-sena">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Fichas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card-sena">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="card-sena">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aprobadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="card-sena">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasa Aprobación</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvalRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.href}
                className="card-sena hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} transition-colors`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Fichas */}
      {recentFichas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Fichas Recientes</h2>
            <Link to="/historial" className="text-sm font-medium text-green-600 hover:text-green-500">
              Ver todas
            </Link>
          </div>

          <div className="card-sena">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ficha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentFichas.map((ficha) => (
                    <tr key={ficha.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ficha.programa}</div>
                        <div className="text-sm text-gray-500">{ficha.numeroAprendices} aprendices</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ficha.numeroFicha}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(ficha.estado)}>{getStatusText(ficha.estado)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(ficha.fechaCreacion).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentFichas.length === 0 && (
        <div className="card-sena text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes fichas creadas</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primera ficha de formación complementaria</p>
          {(user.role === "instructor" || user.role === "coordinador") && (
            <Link to="/crear-ficha" className="btn-sena">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Ficha
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
