import { prisma } from "@/lib/prisma"

export interface CreateNotificationData {
  tipo: string
  titulo: string
  mensaje: string
  usuarioId: string
  solicitudId?: string
}

export class NotificationService {
  static async crearNotificacion(data: CreateNotificationData) {
    try {
      const notificacion = await prisma.notificacion.create({
        data: {
          tipo: data.tipo as any,
          titulo: data.titulo,
          mensaje: data.mensaje,
          usuarioId: data.usuarioId,
          solicitudId: data.solicitudId,
        },
      })
      return notificacion
    } catch (error) {
      console.error("Error creando notificación:", error)
      throw error
    }
  }

  static async notificarNuevaSolicitud(
    solicitudId: string,
    coordinadorId: string,
    instructorNombre: string,
    codigoSolicitud: string,
  ) {
    return this.crearNotificacion({
      tipo: "NUEVA_SOLICITUD",
      titulo: "Nueva solicitud de formación",
      mensaje: `${instructorNombre} ha enviado una nueva solicitud de formación complementaria (${codigoSolicitud})`,
      usuarioId: coordinadorId,
      solicitudId,
    })
  }

  static async notificarSolicitudAprobada(
    solicitudId: string,
    instructorId: string,
    codigoSolicitud: string,
    numeroFicha: string,
  ) {
    return this.crearNotificacion({
      tipo: "SOLICITUD_APROBADA",
      titulo: "Solicitud aprobada",
      mensaje: `Tu solicitud ${codigoSolicitud} ha sido aprobada. Número de ficha asignado: ${numeroFicha}`,
      usuarioId: instructorId,
      solicitudId,
    })
  }

  static async notificarSolicitudRechazada(
    solicitudId: string,
    instructorId: string,
    codigoSolicitud: string,
    comentarios?: string,
  ) {
    return this.crearNotificacion({
      tipo: "SOLICITUD_RECHAZADA",
      titulo: "Solicitud rechazada",
      mensaje: `Tu solicitud ${codigoSolicitud} ha sido rechazada. ${comentarios ? `Comentarios: ${comentarios}` : ""}`,
      usuarioId: instructorId,
      solicitudId,
    })
  }

  static async notificarAsignacionFicha(solicitudId: string, instructorId: string, numeroFicha: string) {
    return this.crearNotificacion({
      tipo: "ASIGNACION_FICHA",
      titulo: "Ficha asignada",
      mensaje: `Se ha asignado el número de ficha ${numeroFicha} a tu solicitud aprobada`,
      usuarioId: instructorId,
      solicitudId,
    })
  }
}
