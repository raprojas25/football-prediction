# Progreso del Proyecto - Sesión 005

**Fecha:** 2026-05-06
**Estado:** ✅ Migración Completada

---

## ✅ Completado en Esta Sesión

### Cambio de Backend: FastAPI → Express.js + TypeScript

**Motivo:** Problemas de instalación de Python packages en Termux (Android).

**Arquitectura Nueva:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Python     │     │  Express.js  │     │  PostgreSQL  │
│   Scraper    │────▶│    API       │◀────│    DB        │
│  (scraper/)  │     │  (src/)      │     │  (sports_db) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                     ┌─────────────┐
                     │   React      │
                     │  (Frontend)  │
                     └─────────────┘
```

---

## 📁 Estructura Backend (Nueva)

```
backend/
├── package.json              ← Dependencias npm
├── tsconfig.json            ← Config TypeScript
├── prisma/
│   └── schema.prisma        ← Modelos DB (Prisma)
├── .env                     ← Variables entorno
├── src/
│   ├── index.ts             ← Entry point Express
│   ├── seed.ts              ← Script para cargar datos JSON a DB
│   ├── routes/
│   │   ├── leagues.ts       ← GET /api/leagues
│   │   ├── teams.ts         ← GET /api/teams
│   │   ├── stats.ts         ← GET /api/stats
│   │   └── predictions.ts   ← POST /api/predictions/generate
│   └── services/
│       └── predictionEngine.ts  ← Motor de predicciones
└── scraper/                 ← Python (separado del backend)
    ├── scraper_multi_ligas.py
    └── soccerstats.py
```

---

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/leagues | Lista todas las ligas |
| GET | /api/leagues/:id | Detalle de liga |
| GET | /api/leagues/:id/teams | Equipos de una liga |
| GET | /api/teams | Lista todos los equipos |
| GET | /api/teams/:id | Detalle de equipo |
| GET | /api/teams/:id/stats | Últimas estadísticas (10) |
| GET | /api/teams/:id/history | Histórico de partidos (20) |
| GET | /api/stats/team/:id | Stats de equipo |
| GET | /api/stats/compare/:homeId/:awayId | Comparar 2 equipos |
| POST | /api/predictions/generate | Generar predicción |
| GET | /api/predictions/match/:id | Predicción por partido |
| GET | /api/predictions/league/:id | Predicciones de liga |

---

## 📦 Modelo de Datos (Prisma)

```prisma
League → Team → TeamStats
Match → Prediction
```

**Tablas:**
- `leagues` - Ligas (Bundesliga, Premier, etc.)
- `teams` - Equipos con leagueId
- `team_stats` - Estadísticas por partido (home/away)
- `matches` - Partidos programados/jugados
- `predictions` - Predicciones generadas

---

## 🚀 Comandos para Ejecutar (Termux)

```bash
cd backend

# 1. Instalar dependencias
npm install

# 2. Generar cliente Prisma
npx prisma generate

# 3. Crear tablas en DB
npx prisma db push

# 4. Cargar datos desde JSONs
npm run seed

# 5. Iniciar servidor
npm run dev
```

**Servidor:** http://localhost:3000

---

## 📊 Seed Data

El script `seed.ts` carga datos desde:
```
frontend/public/data/
├── alemania.json   (18 equipos - REALES)
├── inglaterra.json (18 equipos)
├── espana.json     (18 equipos)
├── italia.json     (18 equipos)
└── francia.json    (18 equipos)
```

---

## ⏳ Pendiente (Próximas Sesiones)

1. **Probar backend** en Termux - verificar conexión a PostgreSQL
2. **Actualizar frontend** - conectar con API Express (:3000)
3. **Crear match** - tabla de partidos y generación de predicciones automáticas
4. **Scraper Python** - actualizar para guardar directo en DB

---

## 🔧 Dependencias Backend

```json
{
  "express": "^4.18.3",
  "@prisma/client": "^5.10.0",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "morgan": "^1.10.0",
  "zod": "^3.22.4"
}
```

---

## 📝 Notas

- El scraper Python sigue funcionando pero está separado del backend
- La integración entre scraper y API es via **DB compartida** (más simple)
- Frontend actualmente usa datos JSON locales, necesita conectar a API
- El motor de predicciones (`predictionEngine.ts`) calcula:
  - PGL/PGV (goles esperados)
  - Over 1.5/2.5/3.5
  - BTTS
  - Corners over 9.5
  - Nivel de confianza

---

*Documento actualizado - Listo para continuar en siguiente sesión*