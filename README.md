# GatorCommunities

Campus club and event discovery platform for UF students with personalized recommendations.

## Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:3000

### Backend Setup
```bash
cd backend
pyenv local 3.10.1
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Runs on http://localhost:8000 (check `/docs` for API endpoints)

## Project Structure

- **`frontend/src/`** - where you write React code (pages, components, utilities)
- **`backend/main.py`** - where you write API endpoints
- **`backend/requirements.txt`** - Python dependencies (update this when you add packages)

## Adding Packages

**Frontend:**
```bash
cd frontend
npm install package-name
```

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt
```

## Root Config Files

Don't touch these — they configure the frameworks:
- `frontend/`: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`
- `backend/`: `requirements.txt` (but update this when adding packages)

## Environment Variables

Copy `.env.example` to `.env` in the backend folder and fill in real values

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Python, FastAPI
- Database: PostgreSQL (setup WIP)
