# 🚀 Guía de Despliegue - NorteGAS Puntos

## 📋 Opciones de Despliegue

### 🔧 Desarrollo Local

#### Opción 1: Script Automático (Recomendado)
```bash
# Configuración inicial
./scripts/setup.sh

# Iniciar ambos servicios
./scripts/start.sh
```

#### Opción 2: Manual
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

### ☁️ Producción en la Nube

#### 🌐 Frontend (Vercel/Netlify)

**Vercel:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde la carpeta frontend/
cd frontend
vercel

# Configurar variables de entorno en Vercel:
# VITE_API_URL=https://tu-backend.herokuapp.com
```

**Netlify:**
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Desde la carpeta frontend/
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

#### 🔧 Backend (Heroku/Railway)

**Heroku:**
```bash
# Instalar Heroku CLI
# Desde la carpeta backend/

# Crear Procfile
echo "web: gunicorn -w 4 -b 0.0.0.0:\$PORT src.main:app" > Procfile

# Agregar gunicorn a requirements.txt
echo "gunicorn==21.2.0" >> requirements.txt

# Deploy
heroku create nortegas-backend
heroku addons:create heroku-postgresql:mini
heroku config:set SECRET_KEY=tu_clave_secreta_aqui
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

**Railway:**
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Desde la carpeta backend/
railway login
railway init
railway add postgresql
railway deploy
```

#### 🗄️ Base de Datos

**PostgreSQL (Producción):**

1. **Crear base de datos** en tu proveedor (Heroku, Railway, etc.)

2. **Actualizar configuración** en `backend/.env`:
```env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

3. **Modificar** `backend/src/main.py`:
```python
# Cambiar de SQLite a PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
```

### 🐳 Docker (Opcional)

#### Dockerfile para Backend
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
EXPOSE 5000

CMD ["python", "src/main.py"]
```

#### Dockerfile para Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/nortegas
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: nortegas
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔧 Configuración de Producción

### Variables de Entorno

**Frontend (.env):**
```env
VITE_API_URL=https://tu-backend-url.com
VITE_WHATSAPP_NUMBER=5493436214609
VITE_APP_NAME=NorteGAS Puntos
```

**Backend (.env):**
```env
SECRET_KEY=clave_secreta_muy_segura_aqui
DATABASE_URL=postgresql://usuario:password@host:puerto/database
FLASK_ENV=production
CORS_ORIGINS=https://tu-frontend-url.com
JWT_EXPIRATION_DAYS=7
```

### 🔒 Seguridad

#### SSL/HTTPS
- **Frontend**: Automático en Vercel/Netlify
- **Backend**: Configurar en tu proveedor de hosting

#### Variables Secretas
```bash
# Generar clave secreta segura
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### CORS
```python
# En producción, especificar dominios exactos
CORS(app, origins=["https://tu-dominio.com"])
```

### 📊 Monitoreo

#### Health Checks
```bash
# Verificar que la API esté funcionando
curl https://tu-backend.com/api/health
```

#### Logs
```bash
# Heroku
heroku logs --tail -a tu-app

# Railway
railway logs
```

## 🔄 CI/CD (GitHub Actions)

### Frontend Deploy
```yaml
# .github/workflows/frontend.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

### Backend Deploy
```yaml
# .github/workflows/backend.yml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "tu-app-backend"
          heroku_email: "tu-email@example.com"
          appdir: "backend"
```

## 📝 Checklist de Despliegue

### Pre-Despliegue
- [ ] Todas las pruebas pasan localmente
- [ ] Variables de entorno configuradas
- [ ] Base de datos de producción creada
- [ ] SSL/HTTPS configurado
- [ ] CORS configurado correctamente

### Post-Despliegue
- [ ] Health check responde correctamente
- [ ] Frontend se conecta al backend
- [ ] Registro de usuarios funciona
- [ ] Códigos promocionales funcionan
- [ ] Canjes y WhatsApp funcionan
- [ ] Panel admin accesible

### Monitoreo Continuo
- [ ] Logs configurados
- [ ] Alertas de errores
- [ ] Backup de base de datos
- [ ] Métricas de rendimiento

## 🆘 Troubleshooting

### Errores Comunes

**CORS Error:**
```
Access to fetch at 'backend-url' from origin 'frontend-url' has been blocked by CORS policy
```
**Solución:** Verificar configuración de CORS en el backend

**Database Connection Error:**
```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) could not connect to server
```
**Solución:** Verificar DATABASE_URL y credenciales

**Build Error en Frontend:**
```
Module not found: Can't resolve './components/Component'
```
**Solución:** Verificar imports y rutas de archivos

### Comandos Útiles

```bash
# Verificar logs del backend
tail -f logs/app.log

# Reiniciar servicios
pm2 restart all

# Verificar conexión a base de datos
python -c "from src.models.user import db; print('DB OK')"

# Limpiar cache de npm
npm cache clean --force
```

## 📞 Soporte

Para problemas de despliegue:
- **Documentación**: Consultar README.md
- **Issues**: GitHub Issues del proyecto
- **Email**: soporte@nortegas.com

