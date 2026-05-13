# Canvas Communities

Canvas Communities is a full-stack campus engagement platform designed to help university students discover organizations, events, and communities personalized to their interests and activity.

The platform uses a hybrid recommendation system powered by user interests and behavioral interaction data to surface relevant student organizations dynamically.

<img width="660" height="425" alt="readme" src="https://github.com/user-attachments/assets/8a93ab67-f119-4a47-8412-636fdbb6828e" />

## Tech Stack

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend:
- FastAPI
- Python
- Prisma ORM

Database & Infrastructure:
- PostgreSQL
- Docker
- Neon
- Render
- Vercel


## Live Demo

- Web App: https://canvas-communities.vercel.app/
- Presentation Video: https://www.youtube.com/watch?v=lxQu0XEIbVM


## Features

- Personalized club recommendations
- Interest-based onboarding flow
- Community discovery and search
- Event and announcement management
- Role-based club administration
- Activity feed and recommendation tracking
- Responsive full-stack web application


## Architecture Overview

Canvas Communities uses a multi-service architecture consisting of:
- A Next.js frontend and API layer
- A PostgreSQL database
- A Python FastAPI recommendation engine

The frontend service manages authentication, UI rendering, and database writes through Prisma ORM, while the ML service reads interaction data from PostgreSQL to generate recommendation scores independently.

This separation allows the recommendation pipeline to run without affecting frontend performance and enables independent deployment of services.


## Recommendation System

Canvas Communities uses a hybrid recommendation system that combines:

- Content-based filtering using Jaccard similarity between user interests and community tags
- Collaborative filtering using the EASE algorithm based on user interaction history
- Popularity-based fallback recommendations for cold-start users

User actions such as views, clicks, RSVPs, and joins are tracked with weighted interaction scores to improve recommendation quality.

Recommendations are pre-computed and cached in the database to provide fast page loads while still adapting to user behavior over time.

## Core Data Models

Key entities include:
- User
- Community
- Tag
- Membership
- Interaction
- Recommendation

The recommendation engine uses user interests, memberships, and interaction history to generate personalized rankings for communities.

## Running Locally

### Option 1: Docker (Recommended)

```bash
# 1. Copy and configure environment variables
cp .env.example .env
# Edit .env with DB_USER and DB_PASSWORD (or use defaults)

# 2. Start all services
docker compose up

# 3. Generate ML recommendations (after containers are running)
curl -X POST http://localhost:8001/recommend/all
```

- Web: http://localhost:3000
- ML Engine: http://localhost:8001/docs

**Note:** Docker handles database migrations and seeding automatically on startup.

### Option 2: Local Development (Without Docker)

**Prerequisites:** PostgreSQL running locally on port 5432

**Terminal 1 — Next.js frontend:**
```bash
cd web-platform
npm install
npx prisma migrate dev  # Run migrations
npx prisma db seed      # Seed test data
npm run dev
```

**Terminal 2 — Python ML engine:**
```bash
cd ml-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

**Terminal 3 — Generate ML recommendations:**
```bash
curl -X POST http://localhost:8001/recommend/all
```

- Web: http://localhost:3000
- ML Engine: http://localhost:8001/docs

**Note:** For local dev, ensure `DATABASE_URL` in root `.env` points to your local PostgreSQL instance.



