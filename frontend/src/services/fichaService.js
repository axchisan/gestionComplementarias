import axios from "axios"

// Configuración base de axios
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

class FichaService {
  constructor() {
    // Datos de demostración para desarrollo
    this.demoFichas = [
      {
        id: 1,
        numeroFicha: "FIC-2024-001",
        programa: "Técnico en Biotecnología",
        numeroAprendices: 25,
        modalidad: "presencial",
        fechaInicio: "2024-03-15",
        duracion: 40,
        justificacion: "Actualización en nuevas técnicas de biotecnología aplicada",
        estado: "pending",
        instructorId: 1,
        instructor: "Carlos Rodríguez",
        centro: "Centro de Biotecnología Industrial",
        fechaCreacion: "2024-01-15T10:30:00Z",
        fechaActualizacion: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        numeroFicha: "FIC-2024-002",
        programa: "Tecnólogo en Gestión Ambiental",
        numeroAprendices: 30,
        modalidad: "virtual",
        fechaInicio: "2024-04-01",
        duracion: 60,
        justificacion: "Formación en nuevas normativas ambientales",
        estado: "approved",
        instructorId: 1,
        instructor: "Carlos Rodríguez",
        centro: "Centro de Biotecnología Industrial",
        fechaCreacion: "2024-01-20T14:15:00Z",
        fechaActualizacion: "2024-01-25T09:45:00Z",
      },
      {
        id: 3,
        numeroFicha: "FIC-2024-003",
        programa: "Especialización en Seguridad Industrial",
        numeroAprendices: 20,
        modalidad: "mixta",
        fechaInicio: "2024-05-10",
        duracion: 80,
        justificacion: "Capacitación en protocolos de seguridad actualizados",
        estado: "draft",
        instructorId: 1,
        instructor: "Carlos Rodríguez",
        centro: "Centro de Biotecnología Industrial",
        fechaCreacion: "2024-02-01T11:20:00Z",
        fechaActualizacion: "2024-02-01T11:20:00Z",
      },
    ]
    this.nextId = 4
  }

  async createFicha(fichaData, userId) {
    try {
      // En desarrollo, usar datos demo
      if (import.meta.env.DEV) {
        return this.createFichaDemo(fichaData, userId)
      }

      // En producción, hacer petición real al backend
      const response = await api.post("/fichas", {
        ...fichaData,
        instructorId: userId,
      })

      return response.data.ficha
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al crear la ficha")
    }
  }

  createFichaDemo(fichaData, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFicha = {
          id: this.nextId++,
          numeroFicha: `FIC-2024-${String(this.nextId - 1).padStart(3, "0")}`,
          ...fichaData,
          instructorId: userId,
          estado: "draft",
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
        }

        this.demoFichas.push(newFicha)
        resolve(newFicha)
      }, 1000)
    })
  }

  async updateFicha(fichaId, updates, userId) {
    try {
      if (import.meta.env.DEV) {
        return this.updateFichaDemo(fichaId, updates, userId)
      }

      const response = await api.put(`/fichas/${fichaId}`, updates)
      return response.data.ficha
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al actualizar la ficha")
    }
  }

  updateFichaDemo(fichaId, updates, userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.demoFichas.findIndex((f) => f.id === fichaId)
        if (index === -1) {
          reject(new Error("Ficha no encontrada"))
          return
        }

        const ficha = this.demoFichas[index]
        if (ficha.instructorId !== userId) {
          reject(new Error("No tienes permisos para editar esta ficha"))
          return
        }

        this.demoFichas[index] = {
          ...ficha,
          ...updates,
          fechaActualizacion: new Date().toISOString(),
        }

        resolve(this.demoFichas[index])
      }, 500)
    })
  }

  async getFichasByUser(userId, filters = {}) {
    try {
      if (import.meta.env.DEV) {
        return this.getFichasByUserDemo(userId, filters)
      }

      const response = await api.get(`/fichas/user/${userId}`, { params: filters })
      return response.data.fichas
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al obtener las fichas")
    }
  }

  getFichasByUserDemo(userId, filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let fichas = this.demoFichas.filter((f) => f.instructorId === userId)

        // Aplicar filtros
        if (filters.estado) {
          fichas = fichas.filter((f) => f.estado === filters.estado)
        }

        if (filters.fechaInicio && filters.fechaFin) {
          fichas = fichas.filter((f) => {
            const fecha = new Date(f.fechaCreacion)
            return fecha >= new Date(filters.fechaInicio) && fecha <= new Date(filters.fechaFin)
          })
        }

        // Ordenar por fecha de creación (más recientes primero)
        fichas.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))

        resolve(fichas)
      }, 300)
    })
  }

  async getRecentFichas(userId, limit = 5) {
    try {
      if (import.meta.env.DEV) {
        return this.getRecentFichasDemo(userId, limit)
      }

      const response = await api.get(`/fichas/user/${userId}/recent`, {
        params: { limit },
      })
      return response.data.fichas
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al obtener fichas recientes")
    }
  }

  getRecentFichasDemo(userId, limit = 5) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fichas = this.demoFichas
          .filter((f) => f.instructorId === userId)
          .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
          .slice(0, limit)

        resolve(fichas)
      }, 300)
    })
  }

  async getStats(userId) {
    try {
      if (import.meta.env.DEV) {
        return this.getStatsDemo(userId)
      }

      const response = await api.get(`/fichas/user/${userId}/stats`)
      return response.data.stats
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al obtener estadísticas")
    }
  }

  getStatsDemo(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userFichas = this.demoFichas.filter((f) => f.instructorId === userId)

        const total = userFichas.length
        const pending = userFichas.filter((f) => f.estado === "pending").length
        const approved = userFichas.filter((f) => f.estado === "approved").length
        const rejected = userFichas.filter((f) => f.estado === "rejected").length
        const draft = userFichas.filter((f) => f.estado === "draft").length

        const approvalRate = total > 0 ? Math.round((approved / (approved + rejected)) * 100) || 0 : 0

        resolve({
          total,
          pending,
          approved,
          rejected,
          draft,
          approvalRate,
        })
      }, 300)
    })
  }

  async deleteFicha(fichaId, userId) {
    try {
      if (import.meta.env.DEV) {
        return this.deleteFichaDemo(fichaId, userId)
      }

      await api.delete(`/fichas/${fichaId}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al eliminar la ficha")
    }
  }

  deleteFichaDemo(fichaId, userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.demoFichas.findIndex((f) => f.id === fichaId)
        if (index === -1) {
          reject(new Error("Ficha no encontrada"))
          return
        }

        const ficha = this.demoFichas[index]
        if (ficha.instructorId !== userId) {
          reject(new Error("No tienes permisos para eliminar esta ficha"))
          return
        }

        if (ficha.estado !== "draft") {
          reject(new Error("Solo se pueden eliminar fichas en borrador"))
          return
        }

        this.demoFichas.splice(index, 1)
        resolve(true)
      }, 300)
    })
  }

  async submitFicha(fichaId, userId) {
    try {
      if (import.meta.env.DEV) {
        return this.submitFichaDemo(fichaId, userId)
      }

      const response = await api.post(`/fichas/${fichaId}/submit`)
      return response.data.ficha
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al enviar la ficha")
    }
  }

  submitFichaDemo(fichaId, userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.demoFichas.findIndex((f) => f.id === fichaId)
        if (index === -1) {
          reject(new Error("Ficha no encontrada"))
          return
        }

        const ficha = this.demoFichas[index]
        if (ficha.instructorId !== userId) {
          reject(new Error("No tienes permisos para enviar esta ficha"))
          return
        }

        this.demoFichas[index] = {
          ...ficha,
          estado: "pending",
          fechaEnvio: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
        }

        resolve(this.demoFichas[index])
      }, 500)
    })
  }

  async exportToPDF(fichaId) {
    try {
      if (import.meta.env.DEV) {
        return this.exportToPDFDemo(fichaId)
      }

      const response = await api.get(`/fichas/${fichaId}/export/pdf`, {
        responseType: "blob",
      })

      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `ficha-${fichaId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al exportar a PDF")
    }
  }

  exportToPDFDemo(fichaId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ficha = this.demoFichas.find((f) => f.id === fichaId)
        if (!ficha) {
          reject(new Error("Ficha no encontrada"))
          return
        }

        // Simular descarga de PDF
        console.log(`Exportando ficha ${ficha.numeroFicha} a PDF...`)

        resolve({
          success: true,
          filename: `ficha-${ficha.numeroFicha}.pdf`,
          message: "PDF generado exitosamente (simulación)",
        })
      }, 2000)
    })
  }

  async exportToExcel(filters = {}) {
    try {
      if (import.meta.env.DEV) {
        return this.exportToExcelDemo(filters)
      }

      const response = await api.get("/fichas/export/excel", {
        params: filters,
        responseType: "blob",
      })

      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `fichas-${new Date().toISOString().split("T")[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al exportar a Excel")
    }
  }

  exportToExcelDemo(filters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let fichas = [...this.demoFichas]

        // Aplicar filtros
        if (filters.estado) {
          fichas = fichas.filter((f) => f.estado === filters.estado)
        }

        if (filters.fechaInicio && filters.fechaFin) {
          fichas = fichas.filter((f) => {
            const fecha = new Date(f.fechaCreacion)
            return fecha >= new Date(filters.fechaInicio) && fecha <= new Date(filters.fechaFin)
          })
        }

        console.log(`Exportando ${fichas.length} fichas a Excel...`)

        resolve({
          success: true,
          filename: `fichas-${new Date().toISOString().split("T")[0]}.xlsx`,
          count: fichas.length,
          message: "Excel generado exitosamente (simulación)",
        })
      }, 1500)
    })
  }
}

export const fichaService = new FichaService()
export default fichaService
