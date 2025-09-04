-- Insertar Centros de Formación
INSERT INTO centros (id, nombre, codigo, ciudad, region, direccion, telefono) VALUES
('centro_cgao', 'Centro de Gestión Agroempresarial del Oriente', 'CGAO', 'Rionegro', 'Antioquia', 'Carrera 50 # 40-30', '+57 4 569 8000'),
('centro_cti', 'Centro de Tecnologías de la Información', 'CTI', 'Medellín', 'Antioquia', 'Calle 52 # 73-20', '+57 4 440 5000'),
('centro_cia', 'Centro Industrial y de Aviación', 'CIA', 'Bogotá', 'Cundinamarca', 'Avenida 68 # 40-35', '+57 1 546 1500');

-- Insertar Usuarios (Instructores, Coordinadores, Administradores)
INSERT INTO users (id, email, password, name, cedula, telefono, role, "centroId", especialidad) VALUES
-- Instructores
('user_maria', 'maria.gonzalez@sena.edu.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María González Pérez', '43123456', '+57 300 123 4567', 'INSTRUCTOR', 'centro_cgao', 'Producción Agropecuaria'),
('user_carlos', 'carlos.rodriguez@sena.edu.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos Rodríguez Silva', '71234567', '+57 301 234 5678', 'INSTRUCTOR', 'centro_cgao', 'Gestión Empresarial'),
('user_ana', 'ana.martinez@sena.edu.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana Martínez López', '52345678', '+57 302 345 6789', 'INSTRUCTOR', 'centro_cti', 'Tecnologías de la Información'),

-- Coordinadores
('coord_luis', 'luis.herrera@sena.edu.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Luis Herrera Gómez', '80123456', '+57 310 456 7890', 'COORDINADOR', 'centro_cgao', 'Coordinación Académica'),
('coord_sofia', 'sofia.castro@sena.edu.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sofía Castro Ruiz', '60234567', '+57 311 567 8901', 'COORDINADOR', 'centro_cti', 'Coordinación Académica'),

-- Administradores
('admin_system', 'admin@sena.edu.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador del Sistema', '11111111', '+57 320 678 9012', 'ADMIN', 'centro_cgao', NULL);

-- Insertar Programas de Formación
INSERT INTO programas (id, codigo, nombre, "tipoFormacion", modalidad, "duracionHoras", "cupoAprendices", descripcion, "centroId") VALUES
('prog_excel', 'PROG-2024-001', 'Excel Avanzado para Análisis de Datos', 'COMPLEMENTARIA', 'PRESENCIAL', 40, 25, 'Programa enfocado en el manejo avanzado de Excel para análisis de datos empresariales y toma de decisiones', 'centro_cgao'),
('prog_python', 'PROG-2024-002', 'Fundamentos de Programación Python', 'COMPLEMENTARIA', 'VIRTUAL', 60, 30, 'Introducción a la programación con Python, estructuras de datos y desarrollo de aplicaciones básicas', 'centro_cti'),
('prog_scrum', 'PROG-2024-003', 'Metodologías Ágiles - Scrum Master', 'TRANSVERSAL', 'MIXTA', 30, 20, 'Gestión de proyectos con metodologías ágiles, certificación Scrum Master', 'centro_cgao'),
('prog_powerbi', 'PROG-2024-004', 'Power BI para Business Intelligence', 'COMPLEMENTARIA', 'PRESENCIAL', 45, 22, 'Creación de dashboards interactivos y análisis de datos con Power BI', 'centro_cgao'),
('prog_javascript', 'PROG-2024-005', 'Desarrollo Web con JavaScript', 'ESPECIFICA', 'VIRTUAL', 80, 28, 'Desarrollo de aplicaciones web modernas con JavaScript, HTML5 y CSS3', 'centro_cti'),
('prog_agricultura', 'PROG-2024-006', 'Agricultura de Precisión con Drones', 'COMPLEMENTARIA', 'PRESENCIAL', 50, 15, 'Uso de tecnología drone para agricultura de precisión y monitoreo de cultivos', 'centro_cgao');

-- Insertar Objetivos de Aprendizaje
INSERT INTO objetivos_aprendizaje (id, descripcion, "programaId", orden) VALUES
-- Excel Avanzado
('obj_excel_1', 'Aplicar funciones avanzadas de Excel para análisis estadístico y financiero', 'prog_excel', 1),
('obj_excel_2', 'Crear dashboards interactivos y reportes automatizados con tablas dinámicas', 'prog_excel', 2),
('obj_excel_3', 'Desarrollar macros y automatizaciones para optimizar procesos empresariales', 'prog_excel', 3),

-- Python
('obj_python_1', 'Comprender los fundamentos de la programación orientada a objetos', 'prog_python', 1),
('obj_python_2', 'Desarrollar algoritmos eficientes usando estructuras de datos apropiadas', 'prog_python', 2),
('obj_python_3', 'Crear aplicaciones básicas con interfaz gráfica usando tkinter', 'prog_python', 3),

-- Scrum
('obj_scrum_1', 'Implementar el framework Scrum en equipos de desarrollo', 'prog_scrum', 1),
('obj_scrum_2', 'Facilitar ceremonias ágiles y gestionar el backlog del producto', 'prog_scrum', 2),

-- Power BI
('obj_powerbi_1', 'Conectar y transformar datos de múltiples fuentes', 'prog_powerbi', 1),
('obj_powerbi_2', 'Diseñar visualizaciones efectivas para la toma de decisiones', 'prog_powerbi', 2);

-- Insertar Competencias
INSERT INTO competencias (id, descripcion, codigo, "programaId") VALUES
-- Excel Avanzado
('comp_excel_1', 'Análisis y procesamiento de información empresarial', 'COMP-001', 'prog_excel'),
('comp_excel_2', 'Uso avanzado de herramientas tecnológicas para la gestión', 'COMP-002', 'prog_excel'),

-- Python
('comp_python_1', 'Lógica de programación y resolución de problemas', 'COMP-003', 'prog_python'),
('comp_python_2', 'Desarrollo de software con buenas prácticas', 'COMP-004', 'prog_python'),

-- Scrum
('comp_scrum_1', 'Liderazgo y gestión de equipos ágiles', 'COMP-005', 'prog_scrum'),
('comp_scrum_2', 'Comunicación efectiva y facilitación de procesos', 'COMP-006', 'prog_scrum'),

-- Power BI
('comp_powerbi_1', 'Análisis de datos y business intelligence', 'COMP-007', 'prog_powerbi'),
('comp_powerbi_2', 'Visualización de información para la toma de decisiones', 'COMP-008', 'prog_powerbi');

-- Insertar Resultados de Aprendizaje
INSERT INTO resultados_aprendizaje (id, descripcion, codigo, "programaId") VALUES
-- Excel Avanzado
('res_excel_1', 'Elaborar reportes de análisis financiero utilizando funciones avanzadas de Excel', 'RA-001', 'prog_excel'),
('res_excel_2', 'Automatizar procesos de análisis mediante macros y funciones personalizadas', 'RA-002', 'prog_excel'),
('res_excel_3', 'Crear dashboards ejecutivos con indicadores clave de rendimiento (KPI)', 'RA-003', 'prog_excel'),

-- Python
('res_python_1', 'Desarrollar aplicaciones de escritorio básicas con Python', 'RA-004', 'prog_python'),
('res_python_2', 'Implementar algoritmos de ordenamiento y búsqueda eficientes', 'RA-005', 'prog_python'),
('res_python_3', 'Crear scripts de automatización para tareas repetitivas', 'RA-006', 'prog_python'),

-- Scrum
('res_scrum_1', 'Facilitar reuniones de planificación y retrospectivas de sprint', 'RA-007', 'prog_scrum'),
('res_scrum_2', 'Gestionar el backlog del producto y priorizar historias de usuario', 'RA-008', 'prog_scrum'),

-- Power BI
('res_powerbi_1', 'Crear modelos de datos relacionales para análisis empresarial', 'RA-009', 'prog_powerbi'),
('res_powerbi_2', 'Desarrollar dashboards interactivos con drill-down y filtros dinámicos', 'RA-010', 'prog_powerbi');

-- Insertar algunas solicitudes de ejemplo
INSERT INTO solicitudes (
  id, codigo, "instructorId", "programaId", "fechaInicio", "fechaFin", 
  "numeroAprendices", justificacion, "objetivosPersonalizados", 
  metodologia, "criteriosEvaluacion", "cumpleRequisitos", 
  "autorizaUsoInfo", "confirmaVeracidad", estado
) VALUES
('sol_001', 'SOL-2024-001', 'user_maria', 'prog_excel', '2024-03-15', '2024-03-29', 25,
 'Se requiere fortalecer las competencias en análisis de datos para mejorar la toma de decisiones en el área agropecuaria',
 ARRAY['Aplicar Excel en análisis de costos de producción agrícola', 'Crear reportes de rentabilidad por cultivo'],
 'Metodología práctica con casos reales del sector agropecuario, talleres hands-on y proyectos aplicados',
 'Evaluación práctica 60%, proyecto final 30%, participación 10%',
 true, true, true, 'APROBADA'),

('sol_002', 'SOL-2024-002', 'user_carlos', 'prog_scrum', '2024-04-01', '2024-04-15', 20,
 'Necesidad de implementar metodologías ágiles en la gestión de proyectos empresariales del centro',
 ARRAY['Adaptar Scrum para proyectos de formación', 'Mejorar la comunicación en equipos multidisciplinarios'],
 'Simulaciones de proyectos reales, dinámicas de grupo y práctica de ceremonias Scrum',
 'Evaluación continua de participación 40%, proyecto grupal 40%, examen teórico 20%',
 true, true, true, 'EN_REVISION');
