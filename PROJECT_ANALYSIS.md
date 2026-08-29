# Project Analysis: DECIDR + ACDS

## 1. Executive summary

This repository contains a two-layer decision intelligence platform designed to connect organizational planning with individual execution.

- The personal layer, called DECIDR, helps a person make realistic trade-offs between study, fitness, sleep, and schedule constraints.
- The organizational layer, called ACDS / DECIDR Organization Mode, monitors company-level risk, analyzes workforce health, and recommends interventions.
- The two layers communicate through privacy-safe, aggregated signals and decision contracts instead of exposing private individual data.

The project is essentially a B2B2C (business-to-business-to-consumer) AI decision system: an organization decides what needs to happen, and the individual AI decides how and when that can realistically happen.

---

## 2. High-level purpose

The project addresses a common business problem:

> Organizations often send instructions or interventions without considering the real-world constraints of the people who must execute them.

DECIDR solves this by building a personal decision layer that:

- evaluates time, workload, fatigue, and priorities,
- protects hard constraints like sleep,
- recommends the best trade-off when priorities conflict,
- reports only aggregated outcomes back to the organization.

This creates a closed-loop system where:

1. the company identifies risk or required behavior change,
2. it sends a structured decision contract or action,
3. the employee-facing assistant adapts that action to personal context,
4. the system sends back anonymized, aggregated metrics rather than private data.

---

## 3. Repository structure

```text
acds-x-decidrr/
├── README.md                     # Root overview and project startup instructions
├── package.json                  # Root script orchestrator for both apps
├── PROJECT_ANALYSIS.md           # This document
├── tests/
│   └── test_end_to_end.py        # End-to-end validation
├── shared/
│   ├── __init__.py
│   ├── contracts.py              # Shared Pydantic schemas for organization-person integration
│   └── models.py                 # Shared model definitions
├── decidr/                       # Personal decision assistant app
│   ├── README.md
│   ├── backend/
│   │   ├── agents/
│   │   │   ├── academic.py
│   │   │   ├── fitness.py
│   │   │   ├── recovery.py
│   │   │   └── schedule.py
│   │   ├── decision_engine.py    # Aggregates all agent outputs
│   │   ├── models.py             # User context and plan models
│   │   ├── server.py             # FastAPI personal API
│   │   └── requirements.txt
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx
│   │       ├── decide/page.tsx
│   │       └── api/
│   ├── supabase/
│   │   └── schema.sql
│   └── package.json
├── acds_platform/
│   ├── backend/
│   │   ├── agents/
│   │   │   ├── finance.py
│   │   │   ├── operations.py
│   │   │   ├── people.py
│   │   │   └── orchestrator.py
│   │   ├── server.py             # FastAPI org API
│   │   └── requirements.txt
│   └── acds-platform/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── README.md
└── acds_platform/                # Located as a sibling directory in the repo tree
```

---

## 4. Main project components

### 4.1 Personal DECIDR app (`decidr/`)

This is the employee-facing system.

It is built around a personal decision engine that evaluates:

- academic urgency,
- workout requirements,
- recovery and sleep protection,
- schedule conflicts and timing feasibility.

Its main backend logic is in:

- `decidr/backend/agents/academic.py`
- `decidr/backend/agents/fitness.py`
- `decidr/backend/agents/recovery.py`
- `decidr/backend/agents/schedule.py`
- `decidr/backend/decision_engine.py`
- `decidr/backend/server.py`

The decision engine runs each agent independently, then combines their outputs into a final decision plan. It enforces hard constraints and produces explainable recommendations rather than a black-box result.

The frontend is a Next.js app that gives the user a way to:

- enter personal context,
- review AI-generated trade-offs,
- accept or modify recommendations,
- view a personal action plan.

### 4.2 Organization ACDS app (`acds_platform/`)

This is the company-facing intelligence layer.

It monitors aggregate workforce data such as:

- workload rate,
- recovery risk,
- schedule conflict rate,
- task completion rate,
- department risk levels.

The backend has specialist agents such as:

- Finance agent
- People agent
- Operations agent
- Orchestrator agent

The orchestrator resolves conflicts between competing concerns and creates a recommendation along with a structured decision contract.

This is the layer that identifies organizational issues and approves actions, such as sending a department-level training or intervention recommendation.

### 4.3 Shared contracts (`shared/`)

The common contract layer is very important to the whole project.

The file `shared/contracts.py` defines models for:

- `CorporateAction`
- `AggregateWorkforceSignal`
- `CorporateRecommendation`
- `DecisionContract`
- `ActionOutcome`
- `DecisionTrace`
- `IntegrationEvent`

These models standardize how the organization and personal systems communicate. They support:

- decision provenance,
- action handoff,
- privacy-safe aggregated signals,
- traceability and review.

This is the backbone of the system's trust model.

---

## 5. Core product flow

The project is designed around a closed loop.

### Flow A: Organization to employee

1. Org backend receives workforce data.
2. Diagnostic agents evaluate risk and trade-offs.
3. Orchestrator produces a recommendation and a decision contract.
4. Executive approval triggers a corporate action.
5. The action is dispatched to the personal DECIDR backend.

### Flow B: Employee to organization

1. Personal DECIDR evaluates the action against individual constraints.
2. It adapts the task to schedule, recovery, and workload realities.
3. It accepts, modifies, defers, or counterproposes the task.
4. Only aggregated outcome data is sent back to the organization.

### Benefits of this design

- employee privacy is protected,
- decision-making is explainable,
- organizational actions are realistic and better adopted,
- the company sees only aggregated outcomes, not personal details.

---

## 6. Technologies used

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vite for the ACDS platform

### Backend

- Python
- FastAPI
- Pydantic models
- Uvicorn

### Agent architecture

- Multiple specialized agents with different decision responsibilities
- Central decision engine / orchestrator
- Human approval layer before sending action to employee

### Data and integration

- Shared contract schema between org and personal systems
- HTTP-based integration between backend services
- Aggregated signal reporting rather than personal data sharing

---

## 7. Why this project matters

This project is not just a dashboard or a simple AI app. It is a design for decision governance.

It combines:

- AI analysis,
- privacy-aware data handling,
- human-centric personalization,
- corporate intervention coordination.

In practical terms, it models a future where AI supports organizational decision-making without ignoring the reality of individual constraints.

This makes it especially relevant for:

- workforce planning,
- employee well-being strategies,
- training and policy execution,
- operations management,
- AI systems that need to act responsibly and explainably.

---

## 8. How to run this project

From the project root, the repository includes orchestration scripts.

### Root commands

```bash
npm install
npm run install:all
pip install -r acds_platform/backend/requirements.txt
pip install -r decidr/backend/requirements.txt
npm run dev
```

This starts both apps and both APIs:

- DECIDR personal UI: http://localhost:3000
- DECIDR organization UI: http://localhost:5173
- Personal API: http://localhost:8000
- Org API: http://localhost:8001

---

## 9. Key insight

The project’s strongest idea is this:

> Organizations should not make decisions in a vacuum; they should negotiate with the realities of the people who execute them.

DECIDR translates that idea into a software architecture: a privacy-aware, intelligent, and explainable decision system that bridges business objectives and personal constraints.

---

## 10. Short conclusion

This repository is best understood as a dual-platform AI system:

- one layer helps the individual optimize their time and energy,
- the other helps the organization detect risk and take action responsibly,
- both are connected through structured contracts, aggregate signals, and decision provenance.

It is a strong example of applied AI architecture for real-world decision support, with emphasis on privacy, explainability, and operational fit.
