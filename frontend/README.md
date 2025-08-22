# 🎨 Frontend - NorteGAS Puntos

Aplicación React para el sistema de puntos de NorteGAS.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install
# o si usas pnpm:
pnpm install

# Ejecutar en desarrollo
npm run dev
# o si usas pnpm:
pnpm run dev
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── Login.jsx        # Pantalla de login
│   ├── Register.jsx     # Pantalla de registro
│   ├── Home.jsx         # Pantalla principal
│   ├── LoadCode.jsx     # Cargar códigos
│   ├── RedeemPoints.jsx # Canjear puntos
│   ├── EmailVerification.jsx # Verificación email
│   └── GarrafaIcon.jsx  # Icono personalizado
├── assets/              # Recursos estáticos
│   └── Nortegas-logo.png
├── App.jsx             # Componente principal
├── App.css             # Estilos globales
└── main.jsx           # Punto de entrada
```

## 🎯 Funcionalidades

### Pantallas Principales
- **Login**: Autenticación de usuarios
- **Registro**: Registro con datos completos
- **Verificación**: Código de verificación por email
- **Inicio**: Dashboard con puntos y acciones
- **Cargar Códigos**: Ingreso de códigos promocionales
- **Canjear Puntos**: Sistema de canjes con WhatsApp

### Características
- ✅ **Diseño Responsivo** para móviles
- ✅ **Branding NorteGAS** completo
- ✅ **Icono de Garrafa** personalizado
- ✅ **Integración WhatsApp** automática
- ✅ **Validaciones** en tiempo real
- ✅ **Navegación fluida** entre pantallas

## 🎨 Tecnologías

- **React** 18 con Vite
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Router** para navegación
- **shadcn/ui** para componentes

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:5000
```

### Conexión con Backend

El frontend está configurado para conectarse automáticamente con el backend en `http://localhost:5000`.

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🎁 Premios Configurados

- **Envío Gratis** (500 puntos)
- **Descuento $5000** (2500 puntos)
- **Taza NorteGAS** (1500 puntos)
- **Gorra NorteGAS** (1500 puntos)

## 📲 Integración WhatsApp

Los canjes de envío y descuento generan automáticamente mensajes de WhatsApp con:
- Datos del cliente
- Información del canje
- Dirección de entrega
- Formato profesional

## 🚀 Build para Producción

```bash
npm run build
# o si usas pnpm:
pnpm run build
```

Los archivos se generan en la carpeta `dist/`.

## 🔄 Próximas Mejoras

- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Más opciones de pago
- [ ] Chat en vivo
- [ ] Geolocalización para entregas

