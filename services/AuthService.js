// Simulación de servicio de autenticación
// En producción, esto se conectaría a una API real

class AuthService {
  constructor() {
    this.users = [
      {
        id: 1,
        email: "instructor@sena.edu.co",
        password: "123456",
        name: "Carlos Rodríguez",
        role: "instructor",
        centro: "Centro de Biotecnología Industrial",
        cedula: "12345678",
        especialidad: "Biotecnología",
      },
      {
        id: 2,
        email: "coordinador@sena.edu.co",
        password: "123456",
        name: "María González",
        role: "coordinador",
        centro: "Centro de Biotecnología Industrial",
        cedula: "87654321",
      },
      {
        id: 3,
        email: "admin@sena.edu.co",
        password: "123456",
        name: "Ana Martínez",
        role: "admin",
        cedula: "11223344",
      },
    ]
  }

  async login(email, password) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = this.users.find((u) => u.email === email && u.password === password)

    if (user) {
      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      return userWithoutPassword
    }

    throw new Error("Credenciales inválidas")
  }

  logout() {
    localStorage.removeItem("currentUser")
  }

  getCurrentUser() {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null
  }

  hasRole(role) {
    const user = this.getCurrentUser()
    return user && user.role === role
  }

  // Métodos para gestión de usuarios (solo admin)
  async createUser(userData) {
    if (!this.hasRole("admin")) {
      throw new Error("No tienes permisos para crear usuarios")
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser = {
      id: this.users.length + 1,
      ...userData,
      createdAt: new Date().toISOString(),
    }

    this.users.push(newUser)
    return newUser
  }

  async registerInstructor(instructorData, coordinadorId) {
    const coordinador = this.users.find((u) => u.id === coordinadorId && u.role === "coordinador")

    if (!coordinador) {
      throw new Error("Solo los coordinadores pueden registrar instructores")
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newInstructor = {
      id: this.users.length + 1,
      ...instructorData,
      role: "instructor",
      centro: coordinador.centro,
      registradoPor: coordinadorId,
      createdAt: new Date().toISOString(),
    }

    this.users.push(newInstructor)
    return newInstructor
  }

  getInstructorsByCentro(centro) {
    return this.users.filter((u) => u.role === "instructor" && u.centro === centro)
  }

  getAllUsers() {
    if (!this.hasRole("admin")) {
      throw new Error("No tienes permisos para ver todos los usuarios")
    }
    return this.users.map(({ password, ...user }) => user)
  }
}

const authService = new AuthService()
export { authService as AuthService }
export default authService
