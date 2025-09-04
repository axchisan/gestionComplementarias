import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...")

  // Limpiar datos existentes
  await prisma.horarioSolicitud.deleteMany()
  await prisma.solicitud.deleteMany()
  await prisma.resultadoAprendizaje.deleteMany()
  await prisma.competencia.deleteMany()
  await prisma.objetivoAprendizaje.deleteMany()
  await prisma.programa.deleteMany()
  await prisma.user.deleteMany()
  await prisma.centro.deleteMany()

  // Hash para las contraseñas
  const hashedPassword = await bcrypt.hash("sena123", 10)

  // Crear Centros
  const centros = await Promise.all([
    prisma.centro.create({
      data: {
        id: "centro_cgao",
        nombre: "Centro de Gestión Agroempresarial del Oriente",
        codigo: "CGAO",
        ciudad: "Rionegro",
        region: "Antioquia",
        direccion: "Carrera 50 # 40-30",
        telefono: "+57 4 569 8000",
      },
    }),
    prisma.centro.create({
      data: {
        id: "centro_cti",
        nombre: "Centro de Tecnologías de la Información",
        codigo: "CTI",
        ciudad: "Medellín",
        region: "Antioquia",
        direccion: "Calle 52 # 73-20",
        telefono: "+57 4 440 5000",
      },
    }),
  ])

  // Crear Usuarios
  const usuarios = await Promise.all([
    // Instructores
    prisma.user.create({
      data: {
        id: "user_maria",
        email: "maria.gonzalez@sena.edu.co",
        password: hashedPassword,
        name: "María González Pérez",
        cedula: "43123456",
        telefono: "+57 300 123 4567",
        role: "INSTRUCTOR",
        centroId: "centro_cgao",
        especialidad: "Producción Agropecuaria",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_carlos",
        email: "carlos.rodriguez@sena.edu.co",
        password: hashedPassword,
        name: "Carlos Rodríguez Silva",
        cedula: "71234567",
        telefono: "+57 301 234 5678",
        role: "INSTRUCTOR",
        centroId: "centro_cgao",
        especialidad: "Gestión Empresarial",
      },
    }),
    // Coordinador
    prisma.user.create({
      data: {
        id: "coord_luis",
        email: "luis.herrera@sena.edu.co",
        password: hashedPassword,
        name: "Luis Herrera Gómez",
        cedula: "80123456",
        telefono: "+57 310 456 7890",
        role: "COORDINADOR",
        centroId: "centro_cgao",
        especialidad: "Coordinación Académica",
      },
    }),
    // Administrador
    prisma.user.create({
      data: {
        id: "admin_system",
        email: "admin@sena.edu.co",
        password: hashedPassword,
        name: "Administrador del Sistema",
        cedula: "11111111",
        telefono: "+57 320 678 9012",
        role: "ADMIN",
        centroId: "centro_cgao",
      },
    }),
  ])

  // Crear Programas
  const programas = await Promise.all([
    prisma.programa.create({
      data: {
        id: "prog_excel",
        codigo: "PROG-2024-001",
        nombre: "Excel Avanzado para Análisis de Datos",
        tipoFormacion: "COMPLEMENTARIA",
        modalidad: "PRESENCIAL",
        duracionHoras: 40,
        cupoAprendices: 25,
        descripcion: "Programa enfocado en el manejo avanzado de Excel para análisis de datos empresariales",
        centroId: "centro_cgao",
      },
    }),
    prisma.programa.create({
      data: {
        id: "prog_python",
        codigo: "PROG-2024-002",
        nombre: "Fundamentos de Programación Python",
        tipoFormacion: "COMPLEMENTARIA",
        modalidad: "VIRTUAL",
        duracionHoras: 60,
        cupoAprendices: 30,
        descripcion: "Introducción a la programación con Python y desarrollo de aplicaciones básicas",
        centroId: "centro_cti",
      },
    }),
    prisma.programa.create({
      data: {
        id: "prog_scrum",
        codigo: "PROG-2024-003",
        nombre: "Metodologías Ágiles - Scrum Master",
        tipoFormacion: "TRANSVERSAL",
        modalidad: "MIXTA",
        duracionHoras: 30,
        cupoAprendices: 20,
        descripcion: "Gestión de proyectos con metodologías ágiles, certificación Scrum Master",
        centroId: "centro_cgao",
      },
    }),
  ])

  // Crear Objetivos de Aprendizaje
  await Promise.all([
    // Excel
    prisma.objetivoAprendizaje.create({
      data: {
        descripcion: "Aplicar funciones avanzadas de Excel para análisis estadístico y financiero",
        programaId: "prog_excel",
        orden: 1,
      },
    }),
    prisma.objetivoAprendizaje.create({
      data: {
        descripcion: "Crear dashboards interactivos y reportes automatizados con tablas dinámicas",
        programaId: "prog_excel",
        orden: 2,
      },
    }),
    // Python
    prisma.objetivoAprendizaje.create({
      data: {
        descripcion: "Comprender los fundamentos de la programación orientada a objetos",
        programaId: "prog_python",
        orden: 1,
      },
    }),
    prisma.objetivoAprendizaje.create({
      data: {
        descripcion: "Desarrollar algoritmos eficientes usando estructuras de datos apropiadas",
        programaId: "prog_python",
        orden: 2,
      },
    }),
  ])

  // Crear Competencias
  await Promise.all([
    prisma.competencia.create({
      data: {
        descripcion: "Análisis y procesamiento de información empresarial",
        codigo: "COMP-001",
        programaId: "prog_excel",
      },
    }),
    prisma.competencia.create({
      data: {
        descripcion: "Lógica de programación y resolución de problemas",
        codigo: "COMP-003",
        programaId: "prog_python",
      },
    }),
  ])

  // Crear Resultados de Aprendizaje
  await Promise.all([
    prisma.resultadoAprendizaje.create({
      data: {
        descripcion: "Elaborar reportes de análisis financiero utilizando funciones avanzadas de Excel",
        codigo: "RA-001",
        programaId: "prog_excel",
      },
    }),
    prisma.resultadoAprendizaje.create({
      data: {
        descripcion: "Desarrollar aplicaciones de escritorio básicas con Python",
        codigo: "RA-004",
        programaId: "prog_python",
      },
    }),
  ])

  console.log("✅ Seed completado exitosamente!")
  console.log("📧 Credenciales de prueba:")
  console.log("   Instructor: maria.gonzalez@sena.edu.co / sena123")
  console.log("   Coordinador: luis.herrera@sena.edu.co / sena123")
  console.log("   Admin: admin@sena.edu.co / sena123")
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
