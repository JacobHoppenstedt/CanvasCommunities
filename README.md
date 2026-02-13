# GatorCommunities

Campus club and event discovery platform for UF students with personalized recommendations.

## Architecture

**Hybrid Monorepo structure:**

```
CanvasCommunities/
├── web-platform/        # Next.js + React + Prisma (UI + Database)
├── ml-engine/           # Python FastAPI (Recommendation Engine)
├── docker-compose.yml   # Local dev with PostgreSQL
└── README.md
```

### Services

- **web-platform** (Port 3000): Next.js application with user interface, API routes, and Prisma ORM
- **ml-engine** (Port 8001): FastAPI service for recommendation scoring (read-only database access)
- **postgres** (Port 5432): Shared PostgreSQL database

## Quick Start with Docker

```bash
cp .env.example .env
# Edit .env with your desired DB_USER and DB_PASSWORD
docker compose up
```

## Local Development (Without Docker)

### Web Platform

```bash
cd web-platform
npm install
npm run dev
```

Runs on `http://localhost:3000`

### ML Engine

```bash
cd ml-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Runs on `http://localhost:8001`

## Project Structure

### `web-platform/`

- `src/app/` - Next.js pages and API routes
- `src/components/` - React components
- `src/lib/` - Utilities and Prisma client
- `prisma/` - Database schema (source of truth)

### `ml-engine/`

- `main.py` - FastAPI application
- `recommender/` - Recommendation algorithms

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **ORM**: Prisma (web-platform), SQLAlchemy (ml-engine)

## API Documentation

- Next.js API routes: `http://localhost:3000/api`
- FastAPI docs: `http://localhost:8001/docs`
