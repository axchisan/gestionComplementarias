# Sistema de Formación Complementaria SENA

Sistema web completo para la gestión automatizada de solicitudes de formación complementaria para instructores del SENA.

## 🎯 Objetivo Principal

Optimizar el proceso de solicitud de formación complementaria mediante un sistema web que automatice la creación, gestión y exportación de fichas de caracterización, mejorando la eficiencia y reduciendo errores manuales.

## 🏗️ Arquitectura del Proyecto

\`\`\`
├── frontend/                         # 🔵 Frontend con React + Tailwind CSS
│   ├── public/                      # Archivos públicos: manifest.json, favicon, etc.
│   │   ├── manifest.json            # Para PWA
│   │   └── service-worker.js        # Workbox PWA
│   │
│   ├── src/
│   │   ├── assets/                 # Imágenes, logos del SENA
│   │   ├── components/             # Componentes reutilizables (Header, Input, etc.)
│   │   ├── pages/                  # Páginas del sistema
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CrearFicha.jsx
│   │   │   └── Historial.jsx
│   │   ├── services/              # Lógica para llamar al backend (axios)
│   │   │   ├── authService.js
│   │   │   └── fichaService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              # Tailwind importado aquí
│   │
│   └── package.json               # Dependencias del frontend (React, Tailwind, etc.)
│
├── .gitignore                      # Ignorar node_modules, .env, etc.
├── README.md                       # Explicación del proyecto
└── docker-compose.yml
\`\`\`

## ✨ Características Principales

### 📱 Frontend React + PWA
- **React 18** con hooks modernos y Context API
- **Tailwind CSS** con tema personalizado del SENA
- **PWA completa** con Service Worker y manifest
- **Responsive design** optimizado para móviles
- **Componentes reutilizables** y modulares

### 🎨 Diseño SENA
- **Colores oficiales**: Verde SENA (#16a34a) como primario
- **Tipografía**: Inter para legibilidad óptima
- **Iconografía**: Lucide React para consistencia
- **Animaciones suaves** y transiciones profesionales

### 🔐 Autenticación y Seguridad
- **Autenticación JWT** con roles diferenciados
- **Interceptores Axios** para manejo automático de tokens
- **Gestión de sesiones** segura con localStorage
- **Control de acceso** granular por funcionalidades

### 📊 Gestión de Fichas
- **Creación paso a paso** con validaciones
- **Estados de seguimiento** (borrador, pendiente, aprobada, rechazada)
- **Historial completo** con filtros avanzados
- **Exportación PDF/Excel** con formatos oficiales

## 👥 Roles del Sistema

### 👨‍🏫 Instructor
- ✅ Crear y gestionar fichas de formación
- ✅ Ver historial personal de solicitudes
- ✅ Exportar fichas individuales a PDF
- ✅ Recibir notificaciones de cambios de estado

### 👨‍💼 Coordinador
- ✅ Aprobar/rechazar fichas de su centro
- ✅ Registrar nuevos instructores
- ✅ Ver información completa de instructores
- ✅ Asignar fichas específicas a instructores

### 👨‍💻 Administrador
- ✅ Gestión completa de usuarios
- ✅ Aprobación final de solicitudes
- ✅ Reportes y estadísticas del sistema
- ✅ Configuración y mantenimiento

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn
- Git

### Instalación del Frontend

\`\`\`bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd sena-formacion-complementaria

# Navegar al frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
\`\`\`

### Variables de Entorno

Crear archivo \`.env.local\` en la carpeta frontend:

\`\`\`env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=SENA Formación Complementaria
VITE_APP_VERSION=1.0.0
\`\`\`

### Scripts Disponibles

\`\`\`bash
# Frontend
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
npm run lint         # Verificar código
npm run build:pwa    # Construir con PWA optimizada
\`\`\`

## 🔑 Usuarios de Demostración

### Credenciales de Acceso

| Rol | Email | Contraseña | Descripción |
|-----|-------|------------|-------------|
| **Instructor** | instructor@sena.edu.co | 123456 | Crear y gestionar fichas |
| **Coordinador** | coordinador@sena.edu.co | 123456 | Aprobar fichas y gestionar instructores |
| **Administrador** | admin@sena.edu.co | 123456 | Administración completa |

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.2** - Framework principal
- **Vite 4.5** - Build tool y dev server
- **React Router DOM 6.20** - Navegación SPA
- **Tailwind CSS 3.3** - Framework CSS
- **Axios 1.6** - Cliente HTTP
- **Lucide React** - Iconografía
- **React Hook Form** - Gestión de formularios
- **React Hot Toast** - Notificaciones

### PWA y Optimización
- **Vite PWA Plugin** - Service Worker automático
- **Workbox** - Estrategias de cache
- **Web App Manifest** - Instalación nativa

### Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento CSS
- **Autoprefixer** - Compatibilidad CSS

## 📱 Funcionalidades PWA

### Instalación Nativa
- **Instalable** en dispositivos móviles y escritorio
- **Iconos adaptativos** para diferentes plataformas
- **Splash screen** personalizada
- **Shortcuts** para acciones rápidas

### Funcionalidad Offline
- **Cache inteligente** de recursos estáticos
- **Datos offline** para consultas básicas
- **Sincronización automática** al recuperar conexión
- **Notificaciones push** (preparado para implementar)

## 🎨 Guía de Estilos

### Colores Principales
\`\`\`css
:root {
  --sena-green: #16a34a;        /* Verde principal */
  --sena-green-light: #22c55e;  /* Verde claro */
  --sena-green-dark: #15803d;   /* Verde oscuro */
  --sena-orange: #f97316;       /* Naranja SENA */
  --sena-blue: #0ea5e9;         /* Azul complementario */
}
\`\`\`

### Componentes Personalizados
- **btn-sena**: Botón principal con estilo SENA
- **card-sena**: Tarjeta con sombra y bordes redondeados
- **input-sena**: Input con focus verde y validación
- **badge-\***: Estados con colores semánticos

## 📊 Métricas y Rendimiento

### Optimizaciones Implementadas
- **Code splitting** automático por rutas
- **Lazy loading** de componentes pesados
- **Compresión de imágenes** automática
- **Tree shaking** para bundle mínimo
- **CSS purging** para estilos no utilizados

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Seguridad

### Medidas Implementadas
- **Sanitización** de inputs del usuario
- **Validación** en cliente y servidor
- **Headers de seguridad** configurados
- **HTTPS** obligatorio en producción
- **Rate limiting** en endpoints críticos

### Gestión de Tokens
- **JWT** con expiración configurable
- **Refresh tokens** para sesiones largas
- **Logout automático** por inactividad
- **Revocación** de tokens comprometidos

## 🚀 Despliegue

### Preparación para Producción
\`\`\`bash
# Construir aplicación
npm run build

# Los archivos se generan en dist/
# Subir a servidor web (Nginx, Apache, etc.)
\`\`\`

### Configuración del Servidor
- **Servidor web**: Nginx o Apache
- **HTTPS**: Certificado SSL obligatorio
- **Compresión**: Gzip habilitado
- **Cache**: Headers apropiados para recursos estáticos

## 📞 Soporte y Contacto

### Soporte Técnico
- **Email**: soporte@sena.edu.co
- **Teléfono**: +57 (1) 546 1500
- **Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

### Documentación Adicional
- **Manual de Usuario**: [Enlace a documentación]
- **API Documentation**: [Enlace a API docs]
- **Guía de Desarrollo**: [Enlace a dev guide]

## 📄 Licencia

Este proyecto está desarrollado para el SENA (Servicio Nacional de Aprendizaje) y está sujeto a sus políticas institucionales y términos de uso.

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear rama feature (\`git checkout -b feature/nueva-funcionalidad\`)
3. Commit cambios (\`git commit -am 'Agregar nueva funcionalidad'\`)
4. Push a la rama (\`git push origin feature/nueva-funcionalidad\`)
5. Crear Pull Request

---

**Desarrollado con ❤️ para el SENA - Servicio Nacional de Aprendizaje**

*Sistema de Formación Complementaria v1.0.0*
