# 🔧 Backend - NorteGAS Puntos

API REST con Flask para el sistema de puntos de NorteGAS.

## 🚀 Instalación

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python src/main.py
```

El servidor estará disponible en: `http://localhost:5000`

## 🏗️ Estructura del Proyecto

```
src/
├── models/              # Modelos de base de datos
│   └── user.py         # Todos los modelos SQLAlchemy
├── routes/             # Rutas de la API
│   ├── auth.py         # Autenticación (register, login)
│   ├── points.py       # Puntos y códigos
│   └── user.py         # Usuarios básico
├── database/           # Base de datos SQLite
│   └── app.db         # (se crea automáticamente)
└── main.py            # Punto de entrada
```

## 📊 Modelos de Base de Datos

### Usuario (usuarios)
- Datos personales completos
- Puntos actuales
- Estado de verificación
- Historial de actividad

### Código Promocional (codigos_promocionales)
- Código único
- Valor en puntos
- Límites de uso
- Fecha de expiración

### Historial de Puntos (historial_puntos)
- Tracking de todas las operaciones
- Tipo: carga o canje
- Código usado
- Fecha y descripción

### Canje Realizado (canjes_realizados)
- Registro completo de canjes
- Datos de entrega
- Estado del pedido
- Seguimiento temporal

### Administrador (administradores)
- Usuarios administrativos
- Roles y permisos
- Acceso al panel

## 🔐 Autenticación

### JWT Tokens
- Tokens seguros con expiración de 7 días
- Verificación automática en rutas protegidas
- Logout seguro

### Endpoints de Auth
```
POST /api/auth/register    # Registro de usuario
POST /api/auth/login       # Login con JWT
POST /api/auth/verify-token # Verificar token
POST /api/auth/logout      # Logout
```

## 🎯 API Endpoints

### Puntos y Códigos
```
GET  /api/user/points      # Consultar puntos actuales
GET  /api/user/history     # Historial de puntos
POST /api/codes/redeem     # Canjear código promocional
POST /api/codes/validate   # Validar código sin canjear
POST /api/rewards/redeem   # Canjear premio
GET  /api/rewards/history  # Historial de canjes
```

### Administración (Próximamente)
```
GET  /api/admin/dashboard  # Dashboard con métricas
GET  /api/admin/users      # Lista de usuarios
POST /api/admin/codes      # Crear códigos
PUT  /api/admin/redemptions/{id}/status # Actualizar estado
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env`:

```env
SECRET_KEY=tu_clave_secreta_aqui
DATABASE_URL=sqlite:///app.db
FLASK_ENV=development
CORS_ORIGINS=http://localhost:5173
```

### Base de Datos

La base de datos SQLite se crea automáticamente al ejecutar la aplicación por primera vez.

#### Datos Iniciales

Se crean automáticamente:

**Códigos Promocionales:**
- NORTEGAS2024 (200 puntos)
- GASNATURAL (300 puntos)
- PROMO2024 (250 puntos)
- BIENVENIDO (100 puntos)
- ESPECIAL (150 puntos)
- BONUS (75 puntos)
- REGALO (200 puntos)
- DEMO123 (50 puntos)

**Administrador:**
- Email: admin@nortegas.com
- Contraseña: admin123

## 🛡️ Seguridad

### Validaciones Implementadas
- Hash seguro de contraseñas (Werkzeug)
- Verificación de tokens JWT
- Validación de datos de entrada
- Protección contra uso duplicado de códigos
- Rate limiting (próximamente)

### CORS
Configurado para permitir requests desde el frontend en desarrollo y producción.

## 📝 Logs y Auditoría

- Todas las operaciones de puntos se registran
- Historial completo de canjes
- Tracking de uso de códigos promocionales
- Logs de autenticación

## 🚀 Despliegue

### Desarrollo
```bash
python src/main.py
```

### Producción
Configurar con un servidor WSGI como Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
```

## 🔄 Migraciones

Para cambios en la base de datos:

```python
# En src/main.py, dentro del contexto de la app:
with app.app_context():
    db.drop_all()  # Solo en desarrollo
    db.create_all()
```

## 📊 Monitoreo

### Health Check
```
GET /api/health
```

Retorna el estado del servidor y la base de datos.

## 🧪 Testing

```bash
# Instalar dependencias de testing
pip install pytest pytest-flask

# Ejecutar tests
pytest tests/
```

## 🔄 Próximas Mejoras

- [ ] Panel administrativo completo
- [ ] Reportes y analytics
- [ ] Notificaciones por email
- [ ] API de estadísticas
- [ ] Integración con sistemas externos
- [ ] Cache con Redis
- [ ] Rate limiting
- [ ] Logs estructurados

