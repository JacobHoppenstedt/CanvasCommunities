# GatorCommunities

## Setup & Run

**Terminal 1:**
```bash
cd web-platform && npm install && npm run dev
```

**Terminal 2:**
```bash
cd ml-engine && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8001
```

- Web: http://localhost:3000
- API: http://localhost:8001/docs
