# Configuración de Base de Datos PostgreSQL

## Opciones para ejecutar PostgreSQL

### Opción 1: PostgreSQL local (requiere instalación)

```bash
# Instalar en Termux (si es posible)
pkg install postgresql

# Iniciar servicio
pg_ctl -D ~/postgres_data start

# Crear base de datos
createdb sports_db

# Credenciales por defecto
# Usuario: postgres
# Contraseña: postgres
# Puerto: 5432
```

### Opción 2: Servicio cloud gratuito (Recomendado)

**Neon (PostgreSQL serverless)**
- 注册免费: https://neon.tech
- 1 proyecto gratis
- Configurar variable:
  ```
  DATABASE_URL=postgresql://user:password@host.neon.tech/sports_db?sslmode=require
  ```

**Supabase**
- 注册免费: https://supabase.com
- PostgreSQL + APIs automaticas

**Railway**
- 注册免费: https://railway.app
- 1 proyecto gratis con PostgreSQL

---

## Configuración

1. Crea un archivo `.env` en `backend/`:

```env
# PostgreSQL local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sports_db

# O con Neon/Supabase/Railway
DATABASE_URL=postgresql://USUARIO:PASSWORD@HOST:PORT/DB_NAME?sslmode=require
```

2. Ejecutar script de inicialización:

```bash
cd backend
pip install -r requirements.txt
python init_db.py
```

---

## Estructura de tablas

- **leagues**: Ligasy países
- **teams**: Equipos por liga
- **team_stats**: Estadísticas históricas
- **matches**: Partidos programados
- **predictions**: Predicciones generadas