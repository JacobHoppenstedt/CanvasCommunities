# GatorCommunities

A campus community discovery platform designed to help University of Florida students find student organizations, personalize their interests, and stay connected with clubs and events that matter to them.

---

## Project Overview

GatorCommunities connects students to the clubs and communities that match their academic interests, hobbies, and goals. The platform lets students:

- Browse and discover student organizations
- Personalize a profile with academic and hobby interests (tags)
- Receive smart club recommendations based on their selected interests
- Join clubs and view their upcoming events
- Navigate a clean sidebar showing their enrolled clubs

> **Note:** The UI sidebar displays the name **Canvas Communities**. Both names refer to the same application; "GatorCommunities" is used in the database, Docker service names, and repository.

---

## Architecture

The project is split into three services, orchestrated with Docker Compose:

| Service | Technology | Port | Purpose |
|---|---|---|---|
| `web-platform` | Next.js 14 (TypeScript), Tailwind CSS, Prisma | 3000 | Frontend + API routes |
| `ml-engine` | Python 3, FastAPI | 8001 | ML/recommendation backend |
| `postgres` | PostgreSQL 17 | 5432 | Relational database |

### `web-platform` (Next.js)

The main user-facing application. Built with:

- **Next.js 14** with the App Router (route groups for layout separation)
- **TypeScript** throughout
- **Tailwind CSS** for styling
- **shadcn/ui** component library (Button, Card, Badge, Avatar, Input, etc.)
- **Prisma ORM** for database access with a PostgreSQL datasource
- **Framer Motion** for sidebar animations
- **Lucide React** for icons

#### Route Structure

| Route Group | Pages | Description |
|---|---|---|
| `(marketing)` | `/` | Public landing page with hero, nav, and UFL login CTA |
| `(auth)` | `/login`, `/signup` | Authentication pages |
| `(onboard)` | `/onboarding/personalize`, `/onboarding/recommended` | New-user interest selection and first recommendations |
| `(app)` | `/personalize`, `/recommended`, `/club/[id]` | Main authenticated app experience |

#### Key Components

- **`LandingPage`** — Marketing hero with navigation links and call-to-action buttons.
- **`Sidebar`** — Collapsible animated sidebar listing main nav (Discover, Activity) and the user's joined clubs. State is persisted in `localStorage`.
- **`ClubCard`** — Displays a club's avatar, name, description, tags, and a Join/Joined toggle button with a link to the club detail page.
- **`InterestPill`** — Toggleable pill tag used on the personalization screen.
- **`PageHeader`** — Reusable title + subtitle header component.
- **`CalendarWidget`**, **`EventCard`** — Support for displaying club events.

### `ml-engine` (FastAPI)

A Python microservice intended to power smart recommendations. Currently exposes:

- `GET /health` — Returns `{ "status": "ok" }`.

This service is the foundation for future ML-based club matching and recommendation logic.

---

## Data Models (Prisma / PostgreSQL)

```
User
├── id          Int       (PK, auto-increment)
├── username    String    (unique)
├── password    String
├── interests   Tag[]     (many-to-many via "UserInterests")
└── memberships Membership[]

Community
├── id          Int       (PK, auto-increment)
├── name        String    (unique)
├── tags        Tag[]     (many-to-many via "CommunityTags")
└── members     Membership[]

Tag
├── id          Int       (PK, auto-increment)
├── name        String    (unique)
├── users       User[]    (many-to-many)
└── communities Community[] (many-to-many)

Membership
├── id          Int       (PK, auto-increment)
├── userId      Int       (FK → User)
├── communityId Int       (FK → Community)
├── joinedAt    DateTime  (default: now())
└── @@unique([userId, communityId])
```

Tags act as the shared vocabulary between user interests and community topics, enabling interest-based matching.

---

## Mock Data (Current Development State)

While the database schema is defined, the frontend currently uses static mock data for rapid UI development:

- **`mockClubs`** — 4 sample clubs: Gator Grilling Club, ColorStack, ACM, Surf Club. Each has a name, description, avatar URL, tags, and joined state.
- **`mockInterests`** — Sample interests across Academic & Career and hobby categories (e.g. Computer Science, Robotics Engineering, Surfing).
- **`mockEvents`** — Sample events linked to clubs by `clubId`.
- **`mockNavigation`** — Navigation structure for the sidebar.

---

## Setup & Run

### Option 1: Docker (Everything)

```bash
cp .env.example .env
# Edit .env with DB_USER and DB_PASSWORD
docker compose up
```

- Web: http://localhost:3000
- API: http://localhost:8001/docs

### Option 2: Local Development

**Terminal 1 — Web Platform:**
```bash
cd web-platform && npm install && npm run dev
```

**Terminal 2 — ML Engine:**
```bash
cd ml-engine && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8001
```

- Web: http://localhost:3000
- API: http://localhost:8001/docs

---

## Environment Variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|---|---|
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |

The `web-platform` service also uses `DATABASE_URL` (auto-constructed in Docker) and `PYTHON_BACKEND_URL` to communicate with the ml-engine.
