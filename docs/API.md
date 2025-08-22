# 📚 Documentación de API - NorteGAS Puntos

## 🌐 Base URL

```
http://localhost:5000/api
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Incluye el token en el header:

```
Authorization: Bearer <tu_jwt_token>
```

## 📋 Endpoints

### 🔑 Autenticación

#### Registro de Usuario
```http
POST /auth/register
```

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123",
  "nombre_completo": "Juan Pérez",
  "dni": "12345678",
  "domicilio": "Av. Corrientes 1234, Buenos Aires",
  "fecha_nacimiento": "1990-05-15"
}
```

**Response:**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "nombre_completo": "Juan Pérez",
    "puntos_actuales": 100,
    "email_verificado": true
  }
}
```

#### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "nombre_completo": "Juan Pérez",
    "puntos_actuales": 150
  }
}
```

#### Verificar Token
```http
POST /auth/verify-token
```

**Body:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "puntos_actuales": 150
  }
}
```

#### Logout
```http
POST /auth/logout
```

**Response:**
```json
{
  "message": "Logout exitoso"
}
```

### 🎯 Puntos y Códigos

#### Consultar Puntos
```http
GET /user/points
Authorization: Bearer <token>
```

**Response:**
```json
{
  "puntos_actuales": 150,
  "usuario": {
    "id": 1,
    "email": "usuario@email.com",
    "nombre_completo": "Juan Pérez"
  }
}
```

#### Historial de Puntos
```http
GET /user/history
Authorization: Bearer <token>
```

**Response:**
```json
{
  "historial": [
    {
      "id": 1,
      "tipo_operacion": "carga",
      "puntos_cantidad": 200,
      "descripcion": "Código promocional: NORTEGAS2024",
      "codigo_usado": "NORTEGAS2024",
      "fecha_operacion": "2024-01-15T10:30:00"
    },
    {
      "id": 2,
      "tipo_operacion": "canje",
      "puntos_cantidad": -500,
      "descripcion": "Canje: Envío Gratis",
      "fecha_operacion": "2024-01-16T14:20:00"
    }
  ]
}
```

#### Validar Código
```http
POST /codes/validate
Authorization: Bearer <token>
```

**Body:**
```json
{
  "codigo": "NORTEGAS2024"
}
```

**Response:**
```json
{
  "valid": true,
  "codigo": {
    "id": 1,
    "codigo": "NORTEGAS2024",
    "puntos_valor": 200,
    "descripcion": "Código promocional NorteGAS 2024"
  },
  "message": "Código válido. Otorga 200 puntos."
}
```

#### Canjear Código
```http
POST /codes/redeem
Authorization: Bearer <token>
```

**Body:**
```json
{
  "codigo": "NORTEGAS2024"
}
```

**Response:**
```json
{
  "message": "¡Código válido! Has ganado 200 puntos NorteGAS.",
  "puntos_ganados": 200,
  "puntos_actuales": 350,
  "codigo": {
    "id": 1,
    "codigo": "NORTEGAS2024",
    "puntos_valor": 200
  }
}
```

### 🎁 Canjes y Premios

#### Canjear Premio
```http
POST /rewards/redeem
Authorization: Bearer <token>
```

**Body:**
```json
{
  "premio_id": "envio_gratis",
  "premio_nombre": "Envío Gratis",
  "puntos_requeridos": 500,
  "nombre_entrega": "Juan Pérez",
  "direccion_entrega": "Av. Corrientes 1234, Buenos Aires"
}
```

**Response:**
```json
{
  "message": "¡Felicitaciones! Has canjeado Envío Gratis por 500 puntos.",
  "puntos_restantes": 50,
  "canje": {
    "id": 1,
    "premio_nombre": "Envío Gratis",
    "puntos_utilizados": 500,
    "estado": "pendiente",
    "fecha_canje": "2024-01-16T14:20:00"
  }
}
```

#### Historial de Canjes
```http
GET /rewards/history
Authorization: Bearer <token>
```

**Response:**
```json
{
  "canjes": [
    {
      "id": 1,
      "premio_nombre": "Envío Gratis",
      "puntos_utilizados": 500,
      "nombre_entrega": "Juan Pérez",
      "direccion_entrega": "Av. Corrientes 1234, Buenos Aires",
      "estado": "pendiente",
      "fecha_canje": "2024-01-16T14:20:00"
    }
  ]
}
```

### 🔧 Sistema

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "NorteGAS Backend API funcionando correctamente"
}
```

## ❌ Códigos de Error

### 400 - Bad Request
```json
{
  "error": "Campo email es requerido"
}
```

### 401 - Unauthorized
```json
{
  "error": "Token inválido o expirado"
}
```

### 404 - Not Found
```json
{
  "error": "Código no válido"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Error interno del servidor"
}
```

## 🎁 Premios Disponibles

| ID | Nombre | Puntos | Descripción |
|----|--------|--------|-------------|
| `envio_gratis` | Envío Gratis | 500 | Delivery gratuito de garrafa |
| `descuento_5000` | Descuento $5000 | 2500 | Descuento en compra de garrafa |
| `taza_nortegas` | Taza NorteGAS | 1500 | Taza exclusiva con logo |
| `gorra_nortegas` | Gorra NorteGAS | 1500 | Gorra oficial con bordado |

## 🔑 Códigos Promocionales

| Código | Puntos | Descripción |
|--------|--------|-------------|
| `NORTEGAS2024` | 200 | Código promocional NorteGAS 2024 |
| `GASNATURAL` | 300 | Código Gas Natural |
| `PROMO2024` | 250 | Promoción especial 2024 |
| `BIENVENIDO` | 100 | Código de bienvenida |
| `ESPECIAL` | 150 | Código especial |
| `BONUS` | 75 | Código bonus |
| `REGALO` | 200 | Código regalo |
| `DEMO123` | 50 | Código demo |

## 📝 Notas Importantes

1. **Tokens JWT**: Expiran en 7 días
2. **Códigos únicos**: Cada usuario puede usar cada código solo una vez
3. **Puntos iniciales**: Nuevos usuarios reciben 100 puntos
4. **Validaciones**: Todos los campos son validados en el servidor
5. **CORS**: Configurado para permitir requests desde el frontend
6. **Base de datos**: SQLite en desarrollo, PostgreSQL recomendado para producción

## 🔄 Próximas Funcionalidades

- [ ] Endpoints de administración
- [ ] Reportes y analytics
- [ ] Notificaciones por email
- [ ] Rate limiting
- [ ] Paginación en listados
- [ ] Filtros avanzados
- [ ] Webhooks para integraciones

