#!/bin/bash

# Script para iniciar Frontend y Backend simultáneamente
# Autor: Manus AI
# Versión: 1.0.0

echo "🔥 Iniciando NorteGAS Puntos..."
echo "==============================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que las dependencias estén instaladas
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Dependencias del frontend no instaladas. Ejecuta: ./scripts/setup.sh"
    exit 1
fi

if [ ! -d "backend/venv" ]; then
    echo "❌ Entorno virtual del backend no creado. Ejecuta: ./scripts/setup.sh"
    exit 1
fi

echo "🚀 Iniciando servicios..."

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servicios detenidos"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Iniciar Backend
echo "🔧 Iniciando Backend..."
cd backend

# Activar entorno virtual según el OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # macOS/Linux
    source venv/bin/activate
fi

python src/main.py &
BACKEND_PID=$!

cd ..

# Esperar un momento para que el backend inicie
sleep 3

# Iniciar Frontend
echo "📱 Iniciando Frontend..."
cd frontend

# Detectar npm o pnpm
if command -v pnpm &> /dev/null; then
    pnpm run dev &
elif command -v npm &> /dev/null; then
    npm run dev &
else
    echo "❌ npm o pnpm no encontrado"
    kill $BACKEND_PID
    exit 1
fi

FRONTEND_PID=$!

cd ..

echo ""
echo "🎉 ¡Servicios iniciados!"
echo "========================"
echo ""
echo "🌐 URLs disponibles:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   API Health: http://localhost:5000/api/health"
echo ""
echo "🔑 Credenciales de administrador:"
echo "   Email: admin@nortegas.com"
echo "   Contraseña: admin123"
echo ""
echo "🎁 Códigos de prueba:"
echo "   NORTEGAS2024, GASNATURAL, PROMO2024, BIENVENIDO"
echo ""
echo "📝 Presiona Ctrl+C para detener ambos servicios"
echo ""

# Esperar indefinidamente
wait

