// Servicio para gestión de solicitudes de formación

class SolicitudService {
  constructor() {
    this.solicitudes = [
      {
        id: 1,
        numeroSolicitud: "SOL-2024-001",
        instructorId: 1,
        instructor: "Carlos Rodríguez",
        centro: "Centro de Biotecnología Industrial",
        programa: "Técnico en Biotecnología",
        numeroFicha: "BT-2024-001",
        numeroAprendices: 25,
        modalidad: "presencial",
        fechaInicio: "2024-03-15",
        duracion: 40,
        justificacion: "Actualización en nuevas técnicas de biotecnología aplicada",
        estado: "pendiente",
        fechaCreacion: "2024-01-15T10:30:00Z",
        fechaActualizacion: "2024-01-15T10:30:00Z",
      },
    ]
    this.nextId = 2
  }

  async createSolicitud(solicitudData, userId) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newSolicitud = {
      id: this.nextId++,
      numeroSolicitud: `SOL-2024-${String(this.nextId - 1).padStart(3, "0")}`,
      instructorId: userId,
      ...solicitudData,
      estado: "borrador",
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }

    this.solicitudes.push(newSolicitud)
    return newSolicitud
  }

  async updateSolicitud(id, updates, userId) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = this.solicitudes.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error("Solicitud no encontrada")
    }

    const solicitud = this.solicitudes[index]

    // Verificar permisos
    if (solicitud.instructorId !== userId) {
      throw new Error("No tienes permisos para editar esta solicitud")
    }

    this.solicitudes[index] = {
      ...solicitud,
      ...updates,
      fechaActualizacion: new Date().toISOString(),
    }

    return this.solicitudes[index]
  }

  async submitSolicitud(id, userId) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const solicitud = this.solicitudes.find((s) => s.id === id && s.instructorId === userId)
    if (!solicitud) {
      throw new Error("Solicitud no encontrada")
    }

    solicitud.estado = "pendiente"
    solicitud.fechaEnvio = new Date().toISOString()
    solicitud.fechaActualizacion = new Date().toISOString()

    return solicitud
  }

  async getSolicitudesByUser(userId) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return this.solicitudes.filter((s) => s.instructorId === userId)
  }

  async getSolicitudesPendientes() {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return this.solicitudes.filter((s) => s.estado === "pendiente")
  }

  async approveSolicitud(id, adminId, comentarios = "") {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = this.solicitudes.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error("Solicitud no encontrada")
    }

    this.solicitudes[index] = {
      ...this.solicitudes[index],
      estado: "aprobada",
      aprobadoPor: adminId,
      fechaAprobacion: new Date().toISOString(),
      comentariosAprobacion: comentarios,
      fechaActualizacion: new Date().toISOString(),
    }

    return this.solicitudes[index]
  }

  async rejectSolicitud(id, adminId, motivo) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = this.solicitudes.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error("Solicitud no encontrada")
    }

    this.solicitudes[index] = {
      ...this.solicitudes[index],
      estado: "rechazada",
      rechazadoPor: adminId,
      fechaRechazo: new Date().toISOString(),
      motivoRechazo: motivo,
      fechaActualizacion: new Date().toISOString(),
    }

    return this.solicitudes[index]
  }

  async deleteSolicitud(id, userId) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = this.solicitudes.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error("Solicitud no encontrada")
    }

    const solicitud = this.solicitudes[index]

    // Solo se pueden eliminar borradores
    if (solicitud.estado !== "borrador") {
      throw new Error("Solo se pueden eliminar solicitudes en borrador")
    }

    // Verificar permisos
    if (solicitud.instructorId !== userId) {
      throw new Error("No tienes permisos para eliminar esta solicitud")
    }

    this.solicitudes.splice(index, 1)
    return true
  }

  // Métodos para reportes y estadísticas
  async getEstadisticas() {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const total = this.solicitudes.length
    const pendientes = this.solicitudes.filter((s) => s.estado === "pendiente").length
    const aprobadas = this.solicitudes.filter((s) => s.estado === "aprobada").length
    const rechazadas = this.solicitudes.filter((s) => s.estado === "rechazada").length
    const borradores = this.solicitudes.filter((s) => s.estado === "borrador").length

    return {
      total,
      pendientes,
      aprobadas,
      rechazadas,
      borradores,
      porcentajeAprobacion: total > 0 ? Math.round((aprobadas / (aprobadas + rechazadas)) * 100) : 0,
    }
  }

  async exportToPDF(solicitudId) {
    // Simular generación de PDF
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const solicitud = this.solicitudes.find((s) => s.id === solicitudId)
    if (!solicitud) {
      throw new Error("Solicitud no encontrada")
    }

    // En una implementación real, aquí se generaría el PDF
    return {
      success: true,
      filename: `solicitud-${solicitud.numeroSolicitud}.pdf`,
      url: "#", // URL del archivo generado
    }
  }

  async exportToExcel(filtros = {}) {
    // Simular generación de Excel
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let solicitudes = [...this.solicitudes]

    // Aplicar filtros si existen
    if (filtros.estado) {
      solicitudes = solicitudes.filter((s) => s.estado === filtros.estado)
    }

    if (filtros.fechaInicio && filtros.fechaFin) {
      solicitudes = solicitudes.filter((s) => {
        const fecha = new Date(s.fechaCreacion)
        return fecha >= new Date(filtros.fechaInicio) && fecha <= new Date(filtros.fechaFin)
      })
    }

    return {
      success: true,
      filename: `solicitudes-${new Date().toISOString().split("T")[0]}.xlsx`,
      url: "#", // URL del archivo generado
      count: solicitudes.length,
    }
  }
}

export const SolicitudService = new SolicitudService()
export default SolicitudService
