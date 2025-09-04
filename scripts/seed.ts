const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Insertar Centros de Formación
  await prisma.centro.createMany({
    data: [
      {
        id: 'centro_001',
        nombre: 'Centro de Gestión Agroempresarial del Oriente',
        codigo: 'CGAO',
        direccion: 'Calle 45 #23-67',
        telefono: '(607) 5551234',
        ciudad: 'Bucaramanga',
        region: 'Santander'
      },
      {
        id: 'centro_002',
        nombre: 'Centro Industrial del Diseño y la Manufactura',
        codigo: 'CIDM',
        direccion: 'Carrera 15 #78-90',
        telefono: '(601) 5555678',
        ciudad: 'Bogotá',
        region: 'Cundinamarca'
      },
      {
        id: 'centro_003',
        nombre: 'Centro de Comercio y Servicios',
        codigo: 'CCS',
        direccion: 'Avenida 80 #45-23',
        telefono: '(604) 5559876',
        ciudad: 'Medellín',
        region: 'Antioquia'
      }
    ]
  });

  // 2. Insertar Usuarios (Instructores y Coordinadores)
  await prisma.user.createMany({
    data: [
      {
        id: 'user_001',
        email: 'carlos.rodriguez@sena.edu.co',
        password: '$2b$10$example1',
        name: 'Carlos Rodríguez Pérez',
        cedula: '12345678',
        telefono: '3001234567',
        role: 'INSTRUCTOR',
        centroId: 'centro_001',
        especialidad: 'Desarrollo de Software'
      },
      {
        id: 'user_002',
        email: 'maria.gonzalez@sena.edu.co',
        password: '$2b$10$example2',
        name: 'María González López',
        cedula: '23456789',
        telefono: '3009876543',
        role: 'INSTRUCTOR',
        centroId: 'centro_001',
        especialidad: 'Gestión Empresarial'
      },
      {
        id: 'user_003',
        email: 'juan.martinez@sena.edu.co',
        password: '$2b$10$example3',
        name: 'Juan Martínez Silva',
        cedula: '34567890',
        telefono: '3005551234',
        role: 'COORDINADOR',
        centroId: 'centro_001',
        especialidad: 'Coordinación Académica'
      },
      {
        id: 'user_004',
        email: 'ana.torres@sena.edu.co',
        password: '$2b$10$example4',
        name: 'Ana Torres Ramírez',
        cedula: '45678901',
        telefono: '3007778888',
        role: 'INSTRUCTOR',
        centroId: 'centro_002',
        especialidad: 'Diseño Gráfico'
      },
      {
        id: 'user_005',
        email: 'luis.herrera@sena.edu.co',
        password: '$2b$10$example5',
        name: 'Luis Herrera Castro',
        cedula: '56789012',
        telefono: '3002223333',
        role: 'INSTRUCTOR',
        centroId: 'centro_003',
        especialidad: 'Administración'
      }
    ]
  });

  // 3. Insertar Programas de Formación
  await prisma.programa.createMany({
    data: [
      {
        id: 'prog_001',
        codigo: 'CF-001-2024',
        nombre: 'Excel Básico para Gestión Empresarial',
        tipoFormacion: 'COMPLEMENTARIA',
        modalidad: 'PRESENCIAL',
        duracionHoras: 40,
        cupoAprendices: 25,
        descripcion: 'Curso básico de Excel orientado a la gestión empresarial y análisis de datos',
        centroId: 'centro_001'
      },
      {
        id: 'prog_002',
        codigo: 'CF-002-2024',
        nombre: 'Fundamentos de Programación Web',
        tipoFormacion: 'COMPLEMENTARIA',
        modalidad: 'MIXTA',
        duracionHoras: 60,
        cupoAprendices: 20,
        descripcion: 'Introducción a HTML, CSS y JavaScript para desarrollo web',
        centroId: 'centro_001'
      },
      {
        id: 'prog_003',
        codigo: 'CF-003-2024',
        nombre: 'Gestión de Proyectos Ágiles',
        tipoFormacion: 'TRANSVERSAL',
        modalidad: 'VIRTUAL',
        duracionHoras: 30,
        cupoAprendices: 30,
        descripcion: 'Metodologías ágiles aplicadas a la gestión de proyectos',
        centroId: 'centro_002'
      },
      {
        id: 'prog_004',
        codigo: 'CF-004-2024',
        nombre: 'Marketing Digital Básico',
        tipoFormacion: 'COMPLEMENTARIA',
        modalidad: 'PRESENCIAL',
        duracionHoras: 50,
        cupoAprendices: 15,
        descripcion: 'Estrategias básicas de marketing digital y redes sociales',
        centroId: 'centro_003'
      },
      {
        id: 'prog_005',
        codigo: 'CF-005-2024',
        nombre: 'Contabilidad Básica',
        tipoFormacion: 'COMPLEMENTARIA',
        modalidad: 'DESESCOLARIZADA',
        duracionHoras: 45,
        cupoAprendices: 20,
        descripcion: 'Principios básicos de contabilidad para microempresas',
        centroId: 'centro_001'
      }
    ]
  });

  // 4. Insertar Objetivos de Aprendizaje
  await prisma.objetivoAprendizaje.createMany({
    data: [
      {
        id: 'obj_001',
        descripcion: 'Manejar las funciones básicas de Excel para organización de datos',
        programaId: 'prog_001',
        orden: 1
      },
      {
        id: 'obj_002',
        descripcion: 'Crear fórmulas y gráficos para análisis empresarial',
        programaId: 'prog_001',
        orden: 2
      },
      {
        id: 'obj_003',
        descripcion: 'Estructurar páginas web con HTML semántico',
        programaId: 'prog_002',
        orden: 1
      },
      {
        id: 'obj_004',
        descripcion: 'Aplicar estilos CSS para diseño responsivo',
        programaId: 'prog_002',
        orden: 2
      },
      {
        id: 'obj_005',
        descripcion: 'Implementar interactividad básica con JavaScript',
        programaId: 'prog_002',
        orden: 3
      }
    ]
  });

  // 5. Insertar Competencias
  await prisma.competencia.createMany({
    data: [
      {
        id: 'comp_001',
        descripcion: 'Procesar información de acuerdo con las necesidades de la organización',
        codigo: 'COM-001',
        programaId: 'prog_001'
      },
      {
        id: 'comp_002',
        descripcion: 'Desarrollar aplicaciones web de acuerdo con los requerimientos del cliente',
        codigo: 'COM-002',
        programaId: 'prog_002'
      },
      {
        id: 'comp_003',
        descripcion: 'Gestionar proyectos de acuerdo con los objetivos organizacionales',
        codigo: 'COM-003',
        programaId: 'prog_003'
      }
    ]
  });

  // 6. Insertar Resultados de Aprendizaje
  await prisma.resultadoAprendizaje.createMany({
    data: [
      {
        id: 'res_001',
        descripcion: 'Organizar la información de acuerdo con las normas y procedimientos establecidos',
        codigo: 'RA-001',
        programaId: 'prog_001'
      },
      {
        id: 'res_002',
        descripcion: 'Construir el sistema que cumpla con los requerimientos de la solución informática',
        codigo: 'RA-002',
        programaId: 'prog_002'
      },
      {
        id: 'res_003',
        descripcion: 'Planificar actividades de acuerdo con los objetivos y recursos del proyecto',
        codigo: 'RA-003',
        programaId: 'prog_003'
      }
    ]
  });

  // 7. Insertar Solicitudes de Ejemplo
  await prisma.solicitud.createMany({
    data: [
      {
        id: 'sol_001',
        codigo: 'SOL-2024-001',
        instructorId: 'user_001',
        programaId: 'prog_001',
        fechaCaracterizacion: new Date('2024-01-15T10:00:00'),
        responsableNombre: 'Carlos Rodríguez Pérez',
        responsableCedula: '12345678',
        responsableEmail: 'carlos.rodriguez@sena.edu.co',
        codigoPrograma: 'CF-001-2024',
        versionPrograma: '1',
        duracionMaxima: 40,
        cupoMaximo: 25,
        numeroAprendicesInscribir: 20,
        municipio: 'Bucaramanga',
        departamento: 'Santander',
        nombreEmpresa: 'Escuela Santa Fe',
        nitEmpresa: '900123456-1',
        codigoEmpresa: 'ESF001',
        representanteLegal: 'María Fernanda López',
        fechaCreacionEmpresa: new Date('2020-03-15'),
        direccionEmpresa: 'Calle 50 #25-30, Barbosa',
        telefonosEmpresa: '(607) 5554321',
        lugarFormacion: 'Escuela Santa Fe - Barbosa',
        tipoAmbiente: 'AULA MOVIL',
        programaEmprendimiento: false,
        campesenaConvenio8842: true,
        fullPopularConvenio8882: false,
        inicioInscripcion: new Date('2024-02-01'),
        finalizacionInscripcion: new Date('2024-02-15'),
        fechaInicioCurso: new Date('2024-02-20'),
        fechaFinalizacionCurso: new Date('2024-03-15'),
        fechaInicio: new Date('2024-02-20'),
        fechaFin: new Date('2024-03-15'),
        numeroAprendices: 20,
        justificacion: 'Se requiere fortalecer las competencias en manejo de herramientas ofimáticas para mejorar la gestión administrativa de la institución educativa',
        objetivosPersonalizados: ['Aplicar herramientas de Excel en contextos reales', 'Desarrollar habilidades de análisis de datos'],
        resultadosEsperados: 'Los participantes estarán en capacidad de gestionar información empresarial de manera eficiente',
        observaciones: 'Solicitud para programa CAMPESENA según convenio 8842',
        cumpleRequisitos: true,
        autorizaUsoInfo: true,
        confirmaVeracidad: true,
        estado: 'PENDIENTE',
        fechaSolicitud: new Date('2024-01-15T14:30:00')
      },
      {
        id: 'sol_002',
        codigo: 'SOL-2024-002',
        instructorId: 'user_002',
        programaId: 'prog_002',
        fechaCaracterizacion: new Date('2024-01-20T09:00:00'),
        responsableNombre: 'María González López',
        responsableCedula: '23456789',
        responsableEmail: 'maria.gonzalez@sena.edu.co',
        codigoPrograma: 'CF-002-2024',
        versionPrograma: '1',
        duracionMaxima: 60,
        cupoMaximo: 20,
        numeroAprendicesInscribir: 15,
        municipio: 'Floridablanca',
        departamento: 'Santander',
        nombreEmpresa: 'Fundación Tecnológica del Norte',
        nitEmpresa: '800987654-2',
        codigoEmpresa: 'FTN002',
        representanteLegal: 'Jorge Alberto Ruiz',
        fechaCreacionEmpresa: new Date('2018-07-22'),
        direccionEmpresa: 'Carrera 25 #40-15',
        telefonosEmpresa: '(607) 5556789',
        lugarFormacion: 'Fundación Tecnológica del Norte - Sede Principal',
        tipoAmbiente: 'AULA ESPECIALIZADA',
        programaEmprendimiento: true,
        campesenaConvenio8842: false,
        fullPopularConvenio8882: true,
        inicioInscripcion: new Date('2024-02-05'),
        finalizacionInscripcion: new Date('2024-02-20'),
        fechaInicioCurso: new Date('2024-03-01'),
        fechaFinalizacionCurso: new Date('2024-04-30'),
        fechaInicio: new Date('2024-03-01'),
        fechaFin: new Date('2024-04-30'),
        numeroAprendices: 15,
        justificacion: 'Necesidad de formar jóvenes en competencias digitales básicas para el desarrollo web, contribuyendo al programa FULL POPULAR',
        objetivosPersonalizados: ['Crear sitios web responsivos', 'Implementar buenas prácticas de programación'],
        resultadosEsperados: 'Jóvenes capacitados en desarrollo web básico con posibilidades de vinculación laboral',
        observaciones: 'Programa dirigido a población vulnerable en el marco del convenio FULL POPULAR 8882',
        cumpleRequisitos: true,
        autorizaUsoInfo: true,
        confirmaVeracidad: true,
        estado: 'APROBADA',
        fechaSolicitud: new Date('2024-01-20T11:15:00')
      }
    ]
  });

  // 8. Insertar Horarios Detallados
  await prisma.horarioDetallado.createMany({
    data: [
      // Horarios para SOL-2024-001 (Excel Básico - 40 horas)
      {
        id: 'hor_001',
        solicitudId: 'sol_001',
        diaSemana: 'LUNES',
        fecha: new Date('2024-02-20'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Primera semana del curso'
      },
      {
        id: 'hor_002',
        solicitudId: 'sol_001',
        diaSemana: 'MIERCOLES',
        fecha: new Date('2024-02-22'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Primera semana del curso'
      },
      {
        id: 'hor_003',
        solicitudId: 'sol_001',
        diaSemana: 'VIERNES',
        fecha: new Date('2024-02-24'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Primera semana del curso'
      },
      {
        id: 'hor_004',
        solicitudId: 'sol_001',
        diaSemana: 'LUNES',
        fecha: new Date('2024-02-27'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Segunda semana del curso'
      },
      {
        id: 'hor_005',
        solicitudId: 'sol_001',
        diaSemana: 'MIERCOLES',
        fecha: new Date('2024-03-01'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Segunda semana del curso'
      },
      {
        id: 'hor_006',
        solicitudId: 'sol_001',
        diaSemana: 'VIERNES',
        fecha: new Date('2024-03-03'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Segunda semana del curso'
      },
      {
        id: 'hor_007',
        solicitudId: 'sol_001',
        diaSemana: 'LUNES',
        fecha: new Date('2024-03-06'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Tercera semana del curso'
      },
      {
        id: 'hor_008',
        solicitudId: 'sol_001',
        diaSemana: 'MIERCOLES',
        fecha: new Date('2024-03-08'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Tercera semana del curso'
      },
      {
        id: 'hor_009',
        solicitudId: 'sol_001',
        diaSemana: 'VIERNES',
        fecha: new Date('2024-03-10'),
        horaInicio: '08:00',
        horaFin: '12:00',
        esFlexible: true,
        observaciones: 'Tercera semana del curso'
      },
      {
        id: 'hor_010',
        solicitudId: 'sol_001',
        diaSemana: 'LUNES',
        fecha: new Date('2024-03-13'),
        horaInicio: '08:00',
        horaFin: '16:00',
        esFlexible: true,
        observaciones: 'Jornada intensiva final - 8 horas'
      },
      // Horarios para SOL-2024-002 (Programación Web - 60 horas)
      {
        id: 'hor_011',
        solicitudId: 'sol_002',
        diaSemana: 'MARTES',
        fecha: new Date('2024-03-01'),
        horaInicio: '14:00',
        horaFin: '18:00',
        esFlexible: true,
        observaciones: 'Módulo HTML'
      },
      {
        id: 'hor_012',
        solicitudId: 'sol_002',
        diaSemana: 'JUEVES',
        fecha: new Date('2024-03-03'),
        horaInicio: '14:00',
        horaFin: '18:00',
        esFlexible: true,
        observaciones: 'Módulo HTML'
      },
      {
        id: 'hor_013',
        solicitudId: 'sol_002',
        diaSemana: 'MARTES',
        fecha: new Date('2024-03-08'),
        horaInicio: '14:00',
        horaFin: '18:00',
        esFlexible: true,
        observaciones: 'Módulo CSS'
      },
      {
        id: 'hor_014',
        solicitudId: 'sol_002',
        diaSemana: 'JUEVES',
        fecha: new Date('2024-03-10'),
        horaInicio: '14:00',
        horaFin: '18:00',
        esFlexible: true,
        observaciones: 'Módulo CSS'
      },
      {
        id: 'hor_015',
        solicitudId: 'sol_002',
        diaSemana: 'MARTES',
        fecha: new Date('2024-03-15'),
        horaInicio: '14:00',
        horaFin: '18:00',
        esFlexible: true,
        observaciones: 'Módulo JavaScript'
      },
      {
        id: 'hor_016',
        solicitudId: 'sol_002',
        diaSemana: 'JUEVES',
        fecha: new Date('2024-03-17'),
        horaInicio: '14:00',
        horaFin: '18:00',
        esFlexible: true,
        observaciones: 'Módulo JavaScript'
      },
      {
        id: 'hor_017',
        solicitudId: 'sol_002',
        diaSemana: 'SABADO',
        fecha: new Date('2024-03-19'),
        horaInicio: '08:00',
        horaFin: '17:00',
        esFlexible: false,
        observaciones: 'Taller práctico intensivo - 8 horas (1 hora almuerzo)'
      },
      {
        id: 'hor_018',
        solicitudId: 'sol_002',
        diaSemana: 'SABADO',
        fecha: new Date('2024-03-26'),
        horaInicio: '08:00',
        horaFin: '17:00',
        esFlexible: false,
        observaciones: 'Proyecto final - 8 horas (1 hora almuerzo)'
      },
      {
        id: 'hor_019',
        solicitudId: 'sol_002',
        diaSemana: 'MARTES',
        fecha: new Date('2024-04-02'),
        horaInicio: '14:00',
        horaFin: '18:00',
        esFlexible: true,
        observaciones: 'Presentaciones finales'
      },
      {
        id: 'hor_020',
        solicitudId: 'sol_002',
        diaSemana: 'JUEVES',
        fecha: new Date('2024-04-04'),
        horaInicio: '14:00',
        horaFin: '18:00',
        esFlexible: true,
        observaciones: 'Evaluación y cierre'
      }
    ]
  });

  console.log('Datos de semilla insertados exitosamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });