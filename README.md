# Sistema de Gestión de Formación Complementaria SENA

Sistema web completo desarrollado en Next.js para la gestión automatizada de solicitudes de formación complementaria para instructores del SENA (Servicio Nacional de Aprendizaje).

## 🎯 Objetivo Principal

Optimizar el proceso de solicitud de formación complementaria mediante un sistema web que automatice la creación, gestión y exportación de fichas de caracterización, mejorando la eficiencia administrativa y reduciendo errores manuales en el proceso educativo.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend & Backend**: Next.js 14 (App Router)
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT con Context API
- **UI/UX**: Tailwind CSS + Radix UI + shadcn/ui
- **Contenedores**: Docker + Docker Compose
- **Cache**: Redis para sesiones y optimización

### Estructura del Proyecto
\`\`\`
├── app/                           # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Autenticación JWT
│   │   ├── solicitudes/          # Gestión de solicitudes
│   │   ├── usuarios/             # Gestión de usuarios
│   │   └── reportes/             # Generación de reportes
│   ├── (dashboard)/              # Rutas protegidas
│   │   ├── admin/                # Panel administrativo
│   │   ├── coordinador/          # Panel de coordinación
│   │   └── instructor/           # Panel de instructor
│   ├── auth/                     # Páginas de autenticación
│   └── globals.css               # Estilos globales
├── components/                    # Componentes React reutilizables
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── forms/                    # Formularios especializados
│   ├── dashboards/               # Dashboards por rol
│   └── layout/                   # Componentes de layout
├── lib/                          # Utilidades y configuraciones
│   ├── auth-context.tsx          # Context de autenticación
│   ├── prisma.ts                 # Cliente de Prisma
│   └── utils.ts                  # Utilidades generales
├── prisma/                       # Esquema y migraciones de BD
│   ├── schema.prisma             # Modelo de datos
│   └── migrations/               # Migraciones de BD
├── public/                       # Archivos estáticos
├── Dockerfile                    # Configuración de contenedor
├── docker-compose.yml            # Orquestación de servicios
└── nginx/                        # Configuración de proxy reverso
\`\`\`

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Autenticación JWT** con roles diferenciados (Instructor, Coordinador, Admin)
- **Gestión de sesiones** segura con localStorage y Context API
- **Control de acceso granular** por funcionalidades y rutas
- **Middleware de autenticación** para protección de API routes

### 👥 Gestión de Usuarios por Roles

#### 👨‍🏫 Instructor
- ✅ Crear y gestionar solicitudes de formación complementaria
- ✅ Ver historial personal de solicitudes con filtros
- ✅ Exportar fichas individuales a PDF/Excel
- ✅ Recibir notificaciones de cambios de estado
- ✅ Gestionar horarios y programación de cursos

#### 👨‍💼 Coordinador
- ✅ Aprobar/rechazar solicitudes de su centro de formación
- ✅ Registrar y gestionar instructores del centro
- ✅ Ver información completa y estadísticas de instructores
- ✅ Asignar fichas específicas y gestionar recursos
- ✅ Generar reportes de gestión por centro

#### 👨‍💻 Administrador
- ✅ Gestión completa de usuarios y centros de formación
- ✅ Aprobación final de solicitudes del sistema
- ✅ Reportes y estadísticas globales del sistema
- ✅ Configuración y mantenimiento del sistema
- ✅ Gestión de programas de formación y competencias

### 📊 Gestión Integral de Solicitudes
- **Flujo completo de solicitudes** desde borrador hasta aprobación final
- **Estados de seguimiento** (Borrador, Pendiente, En Revisión, Aprobada, Rechazada)
- **Validaciones automáticas** de requisitos y documentación
- **Generación automática de códigos** de solicitud y fichas
- **Historial completo** con trazabilidad de cambios
- **Notificaciones en tiempo real** para todos los actores

### 📋 Características Específicas SENA
- **Gestión de centros de formación** por regiones
- **Catálogo de programas** con competencias y resultados de aprendizaje
- **Modalidades de formación** (Presencial, Virtual, Mixta, Desescolarizada)
- **Programas especiales** (Emprendimiento, Bilingüismo, Posconflicto, etc.)
- **Horarios detallados** con flexibilidad para cambios
- **Integración con empresas** y entidades solicitantes

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- Docker y Docker Compose
- PostgreSQL (externo o contenedor separado)
- Git

### Configuración de Variables de Entorno

1. **Copiar archivo de ejemplo**:
\`\`\`bash
cp .env.example .env
\`\`\`

2. **Configurar variables principales**:
\`\`\`env
# Base de datos externa (ya configurada en tu VPS)
DATABASE_URL="postgresql://usuario:password@host:puerto/database"

# Autenticación
JWT_SECRET="tu-clave-secreta-jwt-muy-segura"
NEXTAUTH_SECRET="tu-clave-nextauth-muy-segura"
NEXTAUTH_URL="https://tu-dominio.com"

# Redis
REDIS_PASSWORD="tu-password-redis"

# Configuración de producción
NODE_ENV="production"
\`\`\`

### Despliegue con Docker Compose

1. **Construcción y despliegue**:
\`\`\`bash
# Construcción de la imagen
docker-compose build

# Despliegue en producción
docker-compose up -d

# Con Nginx (opcional)
docker-compose --profile production up -d
\`\`\`

2. **Verificación del despliegue**:
\`\`\`bash
# Verificar contenedores
docker-compose ps

# Ver logs
docker-compose logs -f app

# Health check
curl http://localhost:3000/health
\`\`\`

### Configuración de Base de Datos

1. **Generar cliente Prisma**:
\`\`\`bash
docker-compose exec app npx prisma generate
\`\`\`

2. **Ejecutar migraciones**:
\`\`\`bash
docker-compose exec app npx prisma migrate deploy
\`\`\`

3. **Poblar datos iniciales** (opcional):
\`\`\`bash
docker-compose exec app npx prisma db seed
\`\`\`

## 🔧 Configuración para Coolify

### Configuración de Servicio en Coolify

1. **Crear nuevo servicio**:
   - Tipo: Docker Compose
   - Repositorio: Tu repositorio Git
   - Branch: main/production

2. **Variables de entorno en Coolify**:
\`\`\`env
DATABASE_URL=postgresql://usuario:password@tu-db-host:5432/sena_db
JWT_SECRET=tu-jwt-secret-muy-seguro
NEXTAUTH_SECRET=tu-nextauth-secret-muy-seguro
NEXTAUTH_URL=https://tu-dominio.com
REDIS_PASSWORD=tu-redis-password
NODE_ENV=production
\`\`\`

3. **Configuración de dominio**:
   - Asignar dominio personalizado
   - Configurar SSL automático
   - Configurar redirects HTTP → HTTPS

### Optimizaciones para Producción

1. **Recursos recomendados**:
   - CPU: 2 vCPUs mínimo
   - RAM: 2GB mínimo
   - Almacenamiento: 20GB mínimo

2. **Monitoreo**:
   - Health checks configurados
   - Logs centralizados
   - Métricas de rendimiento

## 📊 Base de Datos

### Modelos Principales
- **Users**: Gestión de usuarios con roles
- **Centros**: Centros de formación SENA
- **Programas**: Catálogo de programas de formación
- **Solicitudes**: Solicitudes de formación complementaria
- **HorarioDetallado**: Programación específica de cursos
- **Notificaciones**: Sistema de notificaciones

### Relaciones Clave
- Usuario → Centro (Many-to-One)
- Solicitud → Usuario + Programa (Many-to-One)
- Programa → Centro + Competencias (One-to-Many)
- Horarios → Solicitud (One-to-Many)

## 🔒 Seguridad

### Medidas Implementadas
- **Autenticación JWT** con expiración configurable
- **Validación de entrada** con Zod schemas
- **Rate limiting** en endpoints críticos
- **Headers de seguridad** configurados
- **CORS** configurado para dominios específicos
- **Sanitización** de datos de usuario

### Configuración de Seguridad
- HTTPS obligatorio en producción
- Tokens con rotación automática
- Sesiones con timeout configurable
- Logs de auditoría para acciones críticas

## 📈 Monitoreo y Mantenimiento

### Health Checks
- Endpoint `/health` para verificación de estado
- Verificación de conectividad a base de datos
- Monitoreo de memoria y CPU

### Logs
- Logs estructurados en formato JSON
- Rotación automática de logs
- Integración con sistemas de monitoreo

### Backup y Recuperación
- Backup automático de base de datos (configurar externamente)
- Versionado de código con Git
- Procedimientos de rollback documentados

## 🤝 Contribución y Desarrollo

### Flujo de Desarrollo
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Desarrollo y testing local
4. Commit con mensajes descriptivos
5. Push y creación de Pull Request

### Comandos de Desarrollo
\`\`\`bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Linting
npm run lint

# Testing (cuando se implemente)
npm run test
\`\`\`

## 📞 Soporte y Contacto

### Información del Sistema
- **Versión**: 1.0.0
- **Desarrollado para**: SENA - Servicio Nacional de Aprendizaje
- **Tecnología**: Next.js 14 + PostgreSQL + Docker

### Soporte Técnico
- **Documentación**: Este README y comentarios en código
- **Issues**: Usar el sistema de issues de Git
- **Logs**: Revisar logs de contenedores para debugging

---

**Desarrollado con ❤️ para el SENA - Servicio Nacional de Aprendizaje**

*Sistema de Gestión de Formación Complementaria v1.0.0*
