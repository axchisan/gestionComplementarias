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

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("authToken")
      localStorage.removeItem("currentUser")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

class AuthService {
  constructor() {
    // Usuarios de demostración para desarrollo
    this.demoUsers = [
      {
        id: 1,
        email: "instructor@sena.edu.co",
        password: "123456",
        name: "Carlos Rodríguez",
        role: "instructor",
        centro: "Centro de Biotecnología Industrial",
        cedula: "12345678",
        especialidad: "Biotecnología",
        telefono: "3001234567",
        fechaIngreso: "2020-03-15",
      },
      {
        id: 2,
        email: "coordinador@sena.edu.co",
        password: "123456",
        name: "María González",
        role: "coordinador",
        centro: "Centro de Biotecnología Industrial",
        cedula: "87654321",
        telefono: "3007654321",
        fechaIngreso: "2018-08-20",
      },
      {
        id: 3,
        email: "admin@sena.edu.co",
        password: "123456",
        name: "Ana Martínez",
        role: "admin",
        cedula: "11223344",
        telefono: "3009876543",
        fechaIngreso: "2015-01-10",
      },
    ]
  }

  async login(email, password, remember = false) {
    try {
      // En desarrollo, usar usuarios demo
      if (import.meta.env.DEV) {
        return this.loginDemo(email, password, remember)
      }

      // En producción, hacer petición real al backend
      const response = await api.post("/auth/login", {
        email,
        password,
        remember,
      })

      const { user, token } = response.data

      // Guardar token y usuario
      localStorage.setItem("authToken", token)
      localStorage.setItem("currentUser", JSON.stringify(user))

      if (remember) {
        localStorage.setItem("rememberUser", "true")
      }

      return user
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.")
    }
  }

  loginDemo(email, password, remember = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.demoUsers.find((u) => u.email === email && u.password === password)

        if (user) {
          const { password: _, ...userWithoutPassword } = user

          // Simular token
          const token = `demo-token-${user.id}-${Date.now()}`

          localStorage.setItem("authToken", token)
          localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

          if (remember) {
            localStorage.setItem("rememberUser", "true")
          }

          resolve(userWithoutPassword)
        } else {
          reject(new Error("Credenciales inválidas"))
        }
      }, 1000) // Simular delay de red
    })
  }

  async logout() {
    try {
      // En producción, notificar al backend
      if (!import.meta.env.DEV) {
        await api.post("/auth/logout")
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      // Limpiar almacenamiento local
      localStorage.removeItem("authToken")
      localStorage.removeItem("currentUser")
      localStorage.removeItem("rememberUser")
    }
  }

  async getCurrentUser() {
    const user = localStorage.getItem("currentUser")
    const token = localStorage.getItem("authToken")

    if (!user || !token) {
      return null
    }

    try {
      const userData = JSON.parse(user)

      // En producción, verificar token con el backend
      if (!import.meta.env.DEV) {
        const response = await api.get("/auth/me")
        return response.data.user
      }

      return userData
    } catch (error) {
      console.error("Error al obtener usuario actual:", error)
      this.logout()
      return null
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem("authToken")
    const user = localStorage.getItem("currentUser")
    return !!(token && user)
  }

  hasRole(role) {
    const user = this.getCurrentUser()
    return user && user.role === role
  }

  getToken() {
    return localStorage.getItem("authToken")
  }

  // Métodos para gestión de usuarios (solo admin/coordinador)
  async createUser(userData) {
    try {
      const response = await api.post("/users", userData)
      return response.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al crear usuario")
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData)
      return response.data.user
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al actualizar usuario")
    }
  }

  async deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al eliminar usuario")
    }
  }

  async getUsers(filters = {}) {
    try {
      const response = await api.get("/users", { params: filters })
      return response.data.users
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al obtener usuarios")
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      })
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al cambiar contraseña")
    }
  }

  async resetPassword(email) {
    try {
      await api.post("/auth/reset-password", { email })
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al solicitar restablecimiento de contraseña")
    }
  }
}

export const authService = new AuthService()
export default authService
