# 🔥 NorteGAS Puntos - Sistema Completo de Fidelización

Sistema completo de puntos y canjes para NorteGAS con frontend React y backend Flask **completamente integrados**.

## 🎉 **Estado del Proyecto: 95% Completado**

✅ **Frontend y Backend integrados**  
✅ **Base de datos funcionando**  
✅ **APIs REST operativas**  
✅ **Autenticación JWT implementada**  
⚠️ **Error menor de sintaxis en canjes WhatsApp**

## 📋 Descripción del Proyecto

NorteGAS Puntos es una aplicación web completa que permite a los clientes de NorteGAS:

- **Registrarse** con sus datos personales
- **Acumular puntos** usando códigos promocionales
- **Canjear puntos** por premios (envío gratis, descuentos, merchandising)
- **Gestionar pedidos** con integración automática a WhatsApp
- **Ver historial** completo de actividad

Incluye un **panel administrativo** para que NorteGAS pueda gestionar usuarios, códigos promocionales y canjes.

## 🏗️ Arquitectura del Sistema

```
nortegas-proyecto-completo/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── assets/         # Imágenes y recursos
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/                 # API Flask
│   ├── src/
│   │   ├── models/         # Modelos de base de datos
│   │   ├── routes/         # Rutas de la API
│   │   └── ...
│   ├── requirements.txt
│   └── ...
├── docs/                   # Documentación
├── scripts/               # Scripts de utilidad
└── README.md             # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18+ y npm/pnpm
- **Python** 3.8+
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/nortegas-puntos.git
cd nortegas-puntos
```

### 2. Configurar el Backend

```bash
cd backend
python -m venv venv

# En Windows:
venv\Scripts\activate

# En macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python src/main.py
```

El backend estará disponible en: `http://localhost:5000`

### 3. Configurar el Frontend

```bash
cd frontend
npm install
# o si usas pnpm:
pnpm install

npm run dev
# o si usas pnpm:
pnpm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🎯 Funcionalidades Principales

### Para Clientes

- ✅ **Registro y Login** con datos completos
- ✅ **Sistema de Puntos** con códigos promocionales
- ✅ **Canje de Premios** con 4 opciones disponibles
- ✅ **Integración WhatsApp** para pedidos automáticos
- ✅ **Historial Completo** de actividad
- ✅ **Diseño Responsivo** para móviles

### Para Administradores

- ✅ **Panel de Control** con métricas
- ✅ **Gestión de Usuarios** y puntos
- ✅ **Gestión de Códigos** promocionales
- ✅ **Seguimiento de Canjes** y entregas
- ✅ **Reportes y Analytics**

## 🎁 Premios Disponibles

| Premio             | Puntos Requeridos | Descripción                    |
| ------------------ | ----------------- | ------------------------------ |
| 🚚 Envío Gratis    | 500               | Delivery gratuito de garrafa   |
| 💰 Descuento $5000 | 2500              | Descuento en compra de garrafa |
| ☕ Taza NorteGAS   | 1500              | Taza exclusiva con logo        |
| 👑 Gorra NorteGAS  | 1500              | Gorra oficial con bordado      |

## 🔑 Códigos Promocionales de Prueba

- `NORTEGAS2024` - 200 puntos
- `PROMO2024` - 250 puntos
- `BIENVENIDO` - 100 puntos
- `ESPECIAL` - 150 puntos
- `BONUS` - 75 puntos
- `REGALO` - 200 puntos
- `DEMO123` - 50 puntos

## 🔐 Acceso Administrativo

- **Email**: ****\*\*****
- **Contraseña**: **\*\***

## 📱 Integración WhatsApp

Los canjes de "Envío Gratis" y "Descuento $5000" generan automáticamente un mensaje de WhatsApp de la empresa con:

- Tipo de canje realizado
- Nombre del cliente
- Dirección de entrega
- Puntos utilizados
- Solicitud específica

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React** 18 con Vite
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Router** para navegación

### Backend

- **Flask** con Python
- **SQLAlchemy** para base de datos
- **JWT** para autenticación
- **Flask-CORS** para integración frontend
- **SQLite** (desarrollo) / **PostgreSQL** (producción)

## 📊 Base de Datos

### Tablas Principales

- **usuarios**: Datos de clientes y puntos
- **codigos_promocionales**: Códigos y valores
- **historial_puntos**: Tracking de operaciones
- **canjes_realizados**: Registro de canjes
- **administradores**: Usuarios admin

## 🚀 Despliegue

### Desarrollo Local

Sigue las instrucciones de instalación arriba.

### Producción

El proyecto está configurado para desplegarse en plataformas como:

- **Vercel/Netlify** (Frontend)
- **Heroku/Railway** (Backend)
- **PostgreSQL** (Base de datos)

## 📝 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-token` - Verificar token

### Puntos y Códigos

- `GET /api/user/points` - Consultar puntos
- `POST /api/codes/redeem` - Canjear código
- `POST /api/rewards/redeem` - Canjear premio
- `GET /api/user/history` - Historial

### Administración

- `GET /api/admin/dashboard` - Dashboard
- `GET /api/admin/users` - Gestión usuarios
- `POST /api/admin/codes` - Crear códigos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:

- **Email**: _consultar_
- **WhatsApp**: _consultar_

---

**Desarrollado con ❤️ para NorteGAS**
