#!/bin/bash
# Script corregido para configurar PostgreSQL en Termux

echo "=========================================="
echo "CONFIGURACIÓN DE POSTGRESQL EN TERMUX"
echo "=========================================="

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo ""
    echo "📦 Instalando PostgreSQL..."
    apt update && apt install -y postgresql postgresql-contrib
fi

# Verificar si ya está inicializado
if [ ! -d ~/postgres_data ]; then
    echo ""
    echo "🔧 Inicializando PostgreSQL..."
    mkdir -p ~/postgres_data
    pg_ctl -D ~/postgres_data initdb
fi

# Verificar si ya está corriendo
if ! pg_isready -h localhost &> /dev/null; then
    echo ""
    echo "🚀 Iniciando PostgreSQL..."
    pg_ctl -D ~/postgres_data start -l ~/postgres/logfile
    sleep 3
fi

# Verificar estado
if pg_isready -h localhost; then
    echo "✅ PostgreSQL está corriendo"
else
    echo "❌ Error: PostgreSQL no pudo iniciar"
    exit 1
fi

# Crear usuario y base de datos
echo ""
echo "👤 Creando usuario y base de datos..."

# Pedir contraseña
echo "Ingresa una contraseña para el usuario 'sportsuser':"
read -s PASSWORD
echo ""
echo "Confirma la contraseña:"
read -s PASSWORD2

if [ "$PASSWORD" != "$PASSWORD2" ]; then
    echo "❌ Las contraseñas no coinciden"
    exit 1
fi

# Crear usuario (como postgres)
su - postgres -c "psql -c \"CREATE USER sportsuser WITH PASSWORD '$PASSWORD';\""
su - postgres -c "psql -c \"CREATE DATABASE sports_db OWNER sportsuser;\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE sports_db TO sportsuser;\""

# Probar conexión
echo ""
echo "🔍 Verificando conexión..."
PGPASSWORD=$PASSWORD psql -U sportsuser -d sports_db -h localhost -c "SELECT 1;"

if [ $? -eq 0 ]; then
    echo "✅ ¡Conexión exitosa!"
    
    # Crear archivo .env
    cd "$(dirname "$0")"
    
    cat > .env << EOF
# Database - Configuración local PostgreSQL
DATABASE_URL=postgresql://sportsuser:$PASSWORD@localhost:5432/sports_db

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true
FRONTEND_URL=http://localhost:5173
EOF
    
    echo "✅ Archivo .env creado"
else
    echo "❌ Error en la conexión"
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 CONFIGURACIÓN COMPLETADA"
echo "=========================================="
echo "Usuario: sportsuser"
echo "Base de datos: sports_db"
echo ""
echo "Para cargar datos:"
echo "  cd backend && pip install -r requirements.txt"
echo "  python init_db.py"
echo "=========================================="