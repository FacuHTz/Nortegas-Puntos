#!/bin/bash

# Script de configuración automática para NorteGAS Puntos
# Autor: Manus AI
# Versión: 1.0.0

echo "🔥 Configurando NorteGAS Puntos..."
echo "=================================="

# Verificar prerrequisitos
echo "📋 Verificando prerrequisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión 18+ requerida. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python no está instalado. Por favor instala Python 3.8+ desde https://python.org/"
    exit 1
fi

PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

PYTHON_VERSION=$($PYTHON_CMD -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "✅ Python $PYTHON_VERSION detectado"

# Verificar npm/pnpm
if command -v pnpm &> /dev/null; then
    NPM_CMD="pnpm"
    echo "✅ pnpm detectado"
elif command -v npm &> /dev/null; then
    NPM_CMD="npm"
    echo "✅ npm detectado"
else
    echo "❌ npm o pnpm no encontrado"
    exit 1
fi

echo ""
echo "🚀 Iniciando configuración..."

# Configurar Frontend
echo "📱 Configurando Frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env para frontend..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
fi

echo "📦 Instalando dependencias del frontend..."
$NPM_CMD install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias del frontend instaladas"
else
    echo "❌ Error instalando dependencias del frontend"
    exit 1
fi

cd ..

# Configurar Backend
echo "🔧 Configurando Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env para backend..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
fi

echo "🐍 Creando entorno virtual de Python..."
$PYTHON_CMD -m venv venv

if [ $? -eq 0 ]; then
    echo "✅ Entorno virtual creado"
else
    echo "❌ Error creando entorno virtual"
    exit 1
fi

echo "📦 Instalando dependencias del backend..."

# Activar entorno virtual según el OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # macOS/Linux
    source venv/bin/activate
fi

pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependencias del backend instaladas"
else
    echo "❌ Error instalando dependencias del backend"
    exit 1
fi

cd ..

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p backend/src/database
mkdir -p docs
mkdir -p logs

echo ""
echo "🎉 ¡Configuración completada!"
echo "=========================="
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. 🔧 Iniciar el backend:"
echo "   cd backend"
echo "   source venv/bin/activate  # En Windows: venv\\Scripts\\activate"
echo "   python src/main.py"
echo ""
echo "2. 📱 Iniciar el frontend (en otra terminal):"
echo "   cd frontend"
echo "   $NPM_CMD run dev"
echo ""
echo "3. 🌐 Abrir en el navegador:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "4. 🔑 Credenciales de administrador:"
echo "   Email: admin@nortegas.com"
echo "   Contraseña: admin123"
echo ""
echo "5. 🎁 Códigos de prueba:"
echo "   NORTEGAS2024 (200 puntos)"
echo "   GASNATURAL (300 puntos)"
echo "   PROMO2024 (250 puntos)"
echo ""
echo "📚 Para más información, consulta el README.md"
echo ""
echo "🔥 ¡Disfruta desarrollando con NorteGAS Puntos!"

