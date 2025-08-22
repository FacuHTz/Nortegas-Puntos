# 📁 Estructura del Proyecto NorteGAS Puntos

## 🏗️ Organización General

```
nortegas-proyecto-completo/
├── 📱 frontend/                 # Aplicación React
├── 🔧 backend/                  # API Flask
├── 📚 docs/                     # Documentación
├── 🛠️ scripts/                  # Scripts de utilidad
├── 📋 README.md                 # Documentación principal
├── 📦 package.json              # Configuración del proyecto
├── 🔒 LICENSE                   # Licencia MIT
├── 🚫 .gitignore               # Archivos ignorados por Git
└── 📄 ESTRUCTURA.md            # Este archivo
```

## 📱 Frontend (React)

```
frontend/
├── 📁 src/
│   ├── 🧩 components/          # Componentes React
│   │   ├── Login.jsx           # Pantalla de login
│   │   ├── Register.jsx        # Pantalla de registro
│   │   ├── Home.jsx            # Pantalla principal
│   │   ├── LoadCode.jsx        # Cargar códigos
│   │   ├── RedeemPoints.jsx    # Canjear puntos
│   │   ├── EmailVerification.jsx # Verificación email
│   │   ├── GarrafaIcon.jsx     # Icono personalizado
│   │   └── 🎨 ui/              # Componentes UI (shadcn/ui)
│   ├── 🖼️ assets/              # Recursos estáticos
│   │   └── Nortegas-logo.png   # Logo de NorteGAS
│   ├── 🎣 hooks/               # React hooks personalizados
│   ├── 📚 lib/                 # Utilidades y helpers
│   ├── App.jsx                 # Componente principal
│   ├── App.css                 # Estilos globales
│   ├── main.jsx                # Punto de entrada
│   └── index.css               # Estilos base
├── 📁 public/                  # Archivos públicos
├── 📦 package.json             # Dependencias del frontend
├── ⚙️ vite.config.js           # Configuración de Vite
├── 🎨 tailwind.config.js       # Configuración de Tailwind
├── 📋 README.md                # Documentación del frontend
├── 🔧 .env.example             # Variables de entorno ejemplo
└── 🚫 .gitignore              # Archivos ignorados
```

## 🔧 Backend (Flask)

```
backend/
├── 📁 src/
│   ├── 🗄️ models/              # Modelos de base de datos
│   │   └── user.py             # Todos los modelos SQLAlchemy
│   ├── 🛣️ routes/              # Rutas de la API
│   │   ├── auth.py             # Autenticación (register, login)
│   │   ├── points.py           # Puntos y códigos
│   │   └── user.py             # Usuarios básico
│   ├── 💾 database/            # Base de datos
│   │   └── app.db              # SQLite (se crea automáticamente)
│   ├── 📁 static/              # Archivos estáticos
│   └── main.py                 # Punto de entrada
├── 📦 requirements.txt         # Dependencias de Python
├── 📋 README.md                # Documentación del backend
├── 🔧 .env.example             # Variables de entorno ejemplo
└── 🚫 .gitignore              # Archivos ignorados
```

## 📚 Documentación

```
docs/
├── 📖 API.md                   # Documentación completa de la API
└── 🚀 DEPLOYMENT.md            # Guía de despliegue
```

## 🛠️ Scripts de Utilidad

```
scripts/
├── 🔧 setup.sh                # Configuración automática
└── ▶️ start.sh                 # Iniciar ambos servicios
```

## 🎯 Componentes Principales

### Frontend Components

| Componente | Descripción | Funcionalidad |
|------------|-------------|---------------|
| `Login.jsx` | Pantalla de login | Autenticación de usuarios |
| `Register.jsx` | Pantalla de registro | Registro con datos completos |
| `Home.jsx` | Pantalla principal | Dashboard con puntos y acciones |
| `LoadCode.jsx` | Cargar códigos | Ingreso de códigos promocionales |
| `RedeemPoints.jsx` | Canjear puntos | Sistema de canjes con WhatsApp |
| `EmailVerification.jsx` | Verificación | Código de verificación por email |
| `GarrafaIcon.jsx` | Icono personalizado | Icono de garrafa de gas |

### Backend Models

| Modelo | Tabla | Descripción |
|--------|-------|-------------|
| `User` | usuarios | Datos de clientes y puntos |
| `CodigoPromocional` | codigos_promocionales | Códigos y valores |
| `HistorialPuntos` | historial_puntos | Tracking de operaciones |
| `CanjeRealizado` | canjes_realizados | Registro de canjes |
| `Administrador` | administradores | Usuarios admin |

### Backend Routes

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/api/auth/*` | auth.py | Autenticación y registro |
| `/api/user/*` | points.py | Puntos y códigos |
| `/api/codes/*` | points.py | Códigos promocionales |
| `/api/rewards/*` | points.py | Canjes y premios |

## 🔧 Archivos de Configuración

### Frontend
- `package.json` - Dependencias y scripts
- `vite.config.js` - Configuración de Vite
- `tailwind.config.js` - Configuración de Tailwind CSS
- `components.json` - Configuración de shadcn/ui
- `.env.example` - Variables de entorno

### Backend
- `requirements.txt` - Dependencias de Python
- `.env.example` - Variables de entorno
- `main.py` - Configuración de Flask y base de datos

### Proyecto
- `package.json` - Scripts del proyecto completo
- `.gitignore` - Archivos ignorados por Git
- `LICENSE` - Licencia MIT

## 📦 Dependencias Principales

### Frontend
- **React** 18 - Framework de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Iconos
- **React Router** - Navegación

### Backend
- **Flask** - Framework web
- **SQLAlchemy** - ORM para base de datos
- **Flask-CORS** - Manejo de CORS
- **PyJWT** - Autenticación JWT
- **Werkzeug** - Utilidades web

## 🚀 Scripts Disponibles

### Proyecto Completo
```bash
npm run dev              # Iniciar frontend y backend
npm run install:all      # Instalar todas las dependencias
npm run setup           # Configuración completa
npm run build           # Build del frontend
npm run clean           # Limpiar archivos generados
```

### Scripts Shell
```bash
./scripts/setup.sh      # Configuración automática
./scripts/start.sh      # Iniciar ambos servicios
```

## 📊 Flujo de Datos

```
Usuario → Frontend → API Backend → Base de Datos
                  ↓
              WhatsApp API (para canjes)
```

## 🔐 Seguridad

- **JWT Tokens** para autenticación
- **Hash de contraseñas** con Werkzeug
- **Validación de datos** en frontend y backend
- **CORS** configurado correctamente
- **Variables de entorno** para datos sensibles

## 🎯 Próximas Expansiones

La estructura está preparada para:
- Panel administrativo (`/admin`)
- Notificaciones (`/notifications`)
- Reportes (`/reports`)
- API externa (`/integrations`)
- Testing (`/tests`)

## 📝 Notas de Desarrollo

1. **Modularidad**: Cada componente tiene responsabilidad única
2. **Escalabilidad**: Estructura preparada para crecimiento
3. **Mantenibilidad**: Código organizado y documentado
4. **Reutilización**: Componentes UI reutilizables
5. **Configuración**: Variables de entorno para diferentes ambientes

