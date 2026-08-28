# Decidr — Your Personal Decision Agent

> **Decidr helps student-athletes make the right trade-offs between study, training, and recovery — based on their own goals, constraints, and history.**

Built for the **Tenori Stateless Hackathon 2026** · Track 04 — Personal Assistant

---

## The Problem

Student-athletes constantly balance exams, training, sleep, recovery, and personal commitments. Existing apps track each area in isolation but never answer the critical question:

> **When everything matters, what should I adjust — and what should I protect?**

## The Solution

Decidr is a personal decision layer powered by four specialist AI agents:

| Agent | Role |
|---|---|
| 📚 **Academic Agent** | Evaluates exam urgency and study-time requirements |
| 🏋️ **Fitness Agent** | Determines minimum-viable workouts to maintain consistency |
| 😴 **Recovery Agent** | Protects sleep as a hard constraint and flags fatigue risks |
| 📅 **Schedule Agent** | Detects time conflicts and suggests optimal sequencing |

These agents communicate through a lightweight **A2A protocol** and feed into a central **Decision Engine** that:
- Enforces hard constraints (e.g., "never reduce sleep below 7 h")
- Scores trade-offs between competing priorities
- Produces an **explainable plan** with clear reasoning

## How It Works

```
User inputs today's commitments
→ Four agents analyse independently
→ Decision Engine merges, enforces constraints, ranks options
→ Returns a personalised plan with reasoning
→ User provides feedback → system improves
```

## Quick Start

### Frontend (Next.js)

```bash
cd decidr
npm install
npm run dev
# Open http://localhost:3000
```

### Backend (Python — optional, demo works without it)

```bash
cd decidr/backend
pip install -r requirements.txt
python server.py
# API runs on http://localhost:8000
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Python FastAPI (4 specialist agents) |
| API | Next.js API routes (self-contained demo) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| LLM | NVIDIA NIM (optional enhancement) |
| Agent Protocol | A2A (JSON over HTTP) |
| Deployment | Vercel + Supabase |

## Project Structure

```
decidr/
├── src/
│   └── app/
│       ├── page.tsx              # Landing page
│       ├── decide/page.tsx       # Context form + plan display
│       ├── api/decide/route.ts   # Decision engine API route
│       ├── layout.tsx            # Root layout
│       └── globals.css           # Design system
├── backend/
│   ├── agents/
│   │   ├── academic.py           # Academic Agent
│   │   ├── fitness.py            # Fitness Agent
│   │   ├── recovery.py           # Recovery Agent
│   │   └── schedule.py           # Schedule Agent
│   ├── decision_engine.py        # Orchestrator
│   ├── models.py                 # Shared Pydantic models
│   ├── server.py                 # FastAPI server
│   └── requirements.txt
├── supabase/
│   └── schema.sql                # Database schema
├── .env.example
├── LICENSE                       # MIT
└── README.md
```

## Hackathon Alignment

| Track | Decidr |
|---|---|
| **Track 04 — Personal Assistant** | Core product: AI layer for fitness, study, and recovery |
| **Track 02 — Agentic Web** | Four agents coordinate via A2A protocol |
| **Track 01 — Attention Economy** | Attention-budget protection via the Recovery Agent |

## Team

- **Jenish** — [GitHub](https://github.com/jenish1345)

## License

MIT — see [LICENSE](./LICENSE).
