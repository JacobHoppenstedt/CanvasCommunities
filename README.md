# GatorCommunities

A campus club discovery platform that recommends student organizations based on your interests and behavior.

---

## How the System Works

### The Big Picture

GatorCommunities has three moving parts that work together:

```
Browser (Next.js) ──── PostgreSQL (data)
        │
        └──────────── Python ML Engine (recommendations)
```

- **Next.js** handles everything the user sees and all database writes
- **PostgreSQL** is the single source of truth for all data
- **Python ML Engine** reads from the same database and produces recommendation scores

These are intentionally kept separate. Next.js never runs ML code. Python never writes user data. This means teammates can work on the frontend or backend without breaking the recommendation engine.

---

### Why PostgreSQL?

All user data — accounts, club memberships, interest tags, and behavioral signals — lives in one PostgreSQL database. Both services connect to it, but with different roles:

- **Next.js + Prisma:** full read/write access, owns all schema migrations
- **Python + SQLAlchemy:** read-only access, reflects the schema automatically

Having one database means the recommendation engine always has fresh data. There is no sync job, no data pipeline, no duplication.

---

### Why Two Separate Services?

The Python service exists because recommendation algorithms (matrix factorization, similarity scoring) are better expressed in Python with NumPy/SciPy than in JavaScript. But running those algorithms should never slow down a page load.

The separation means:
- A heavy training job in Python doesn't block a user loading a page in Next.js
- Each service can be deployed, scaled, or restarted independently
- The frontend team and ML team can work without stepping on each other

---

### The Recommendation System

When a user opens the `/recommended` page, here is exactly what happens:

#### Step 1 — User picks interests on /personalize
The user selects interest tags (e.g. Robotics, Social, Engineering). These are saved to the database by Next.js. This is the starting point for all personalization.

#### Step 2 — User behavior is tracked
Every time a user views a club page, clicks a card, RSVPs to an event, or joins a club, a signal is written to the `Interaction` table with a weight:

| Action | Weight | Why this weight? |
|--------|--------|-----------------|
| View   | 0.5    | Passive — just looked |
| Click  | 1.0    | Active — wanted more info |
| RSVP   | 2.0    | Strong intent — planning to attend |
| Join   | 3.0    | Highest signal — committed member |

These weights let the system treat a join as 6x more meaningful than a view, which produces better recommendations than counting all actions equally.

#### Step 3 — Content-Based Filtering (Jaccard Similarity)
The first algorithm compares the user's interest tags against each club's tags using Jaccard similarity:

```
score = (tags in common) / (all unique tags combined)
```

A user who selected `{Robotics, Engineering}` and a club tagged `{Engineering, Robotics, Competition}` would score `2/3 = 0.67`.

**Why this matters:** Works instantly for brand new users who have never interacted with anything. Zero dependency on behavioral data.

#### Step 4 — Collaborative Filtering (EASE Model)
The second algorithm looks at the full interaction history across all users and asks: "users who interacted with similar clubs as you also tend to like THESE clubs."

It uses an algorithm called EASE (Embarrassingly Shallow Autoencoders) which learns an item-item weight matrix from interaction data. The math is a single matrix inversion — no training loops, no neural network, runs in milliseconds.

**Why EASE and not something simpler like cosine similarity?** At 97.5% data sparsity (most users have only interacted with a handful of clubs out of 200), cosine similarity breaks down — it computes dot products that almost always evaluate to zero, making every user look identical. EASE handles sparsity correctly.

#### Step 5 — Hybrid Scoring
The final score combines both signals:

```
final_score = 0.6 × content_score + 0.4 × collaborative_score
```

Both scores are normalized to the same 0–1 range before combining so neither one dominates the other unfairly.

The system automatically adapts based on what data exists for each user:

| User has tags? | User has interactions? | What runs |
|----------------|----------------------|-----------|
| Yes | Yes | Full hybrid (both algorithms) |
| Yes | No | Content-based only (Jaccard) |
| No | Yes | Collaborative only (EASE) |
| No | No | Popularity (most active clubs globally) |

The popularity fallback exists specifically to prevent a blank screen — every user sees something useful on day one, even if they skipped onboarding entirely.

#### Step 6 — Pre-Compute + Cache
Rather than running the ML algorithms live on every page load (which would add latency), the system runs a batch training job that pre-computes recommendations for all users and stores them in the `Recommendation` table.

When a user opens `/recommended`:
1. Next.js calls the Python endpoint `GET /recommendations/{userId}`
2. Python looks up the pre-computed row from the database → instant response
3. Next.js takes the returned community IDs and fetches full club data from Prisma
4. The enriched club objects are sent to the frontend

For brand new users (not yet in the pre-computed results), the Python service falls back to computing Jaccard live, which is fast enough to run on-demand.

---

### Schema Overview

```
User ──── interests ────── Tag ──── communities ──── Community
 │                                                       │
 └──── memberships ──── Membership                       │
 │                                                       │
 └──── interactions ── Interaction ─────────────────────┘
 │                                                       │
 └──── recommendations ── Recommendation ───────────────┘
```

- **Tag** is the bridge between users (interests) and communities (categories)
- **Interaction** is the raw behavioral signal log — append-only, never deleted
- **Recommendation** is the output of the ML engine — pre-computed scores per user per community

---

## Setup & Run

### Option 1: Docker (Everything)

```bash
cp .env.example .env
# Edit .env with DB_USER and DB_PASSWORD
docker compose up
```

- Web: http://localhost:3000
- ML Engine: http://localhost:8001/docs

### Option 2: Local Development

**Terminal 1 — Next.js frontend:**
```bash
cd web-platform && npm install && npm run dev
```

**Terminal 2 — Python ML engine:**
```bash
cd ml-engine && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8001
```

- Web: http://localhost:3000
- ML Engine: http://localhost:8001/docs

### Database Setup

```bash
# Run migrations (creates all tables)
cd web-platform && npx prisma migrate dev

# Seed with test data
cd web-platform && npx prisma db seed
```

### Trigger Recommendation Training

After seeding, run the training pipeline to generate pre-computed recommendations:

```bash
curl -X POST http://localhost:8001/train
```

Then visit http://localhost:3000/recommended to see ranked clubs.
