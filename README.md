# DECIDR

Personal + Organizational Decision Intelligence

## 🚀 Decision intelligence from organization to individual.

**DECIDR** is a unified B2B2C AI decision platform that connects organizational decisions with individual execution without compromising employee privacy.

### The Core Philosophy
The organization decides **WHAT** needs to happen.
The individual AI decides **HOW** and **WHEN** it can realistically happen.
The organization receives only **PRIVACY-SAFE aggregated outcomes**.

---

## 🎯 Architecture

The system operates in a closed-loop integration:

1. **DECIDR Organization Mode (Port 5173 / API 8001)**
   - Monitors aggregate company health and workforce signals.
   - Detects risks and orchestrates AI Corporate Agents (Finance, Workforce, Operations).
   - Generates actionable interventions.
   - Dispatches Corporate Actions to employees.

2. **DECIDR Personal Mode (Port 3000 / API 8000)**
   - Personal AI decision assistant.
   - Ingests Corporate Actions and adapts them to the employee's personal context (schedule, academic deadlines, recovery constraints).
   - Reports back privacy-safe aggregated outcomes to the Organization layer.

---

## ⚡️ One-Command Startup (Development)

This project requires exactly **ONE COMMAND** to start the entire B2B2C ecosystem!

### Prerequisites
- Node.js
- Python 3.9+
- `pip`

### Step 1: Install Dependencies
From the project root directory, run:
```bash
npm install
npm run install:all
pip install -r acds_platform/backend/requirements.txt
pip install -r decidr/backend/requirements.txt
```

### Step 2: Start the Complete Application
From the project root directory, run:
```bash
npm run dev
```

This single command uses `concurrently` to launch:
- `http://localhost:3000` (DECIDR Personal Mode UI)
- `http://localhost:5173` (DECIDR Organization Mode UI)
- `http://localhost:8000` (Personal API)
- `http://localhost:8001` (Organization API)

All systems communicate automatically.

---

## 🎭 The Demo Flow

1. Open **DECIDR Organization** (`http://localhost:5173`).
2. Notice the elevated Engineering risk detected by the agents.
3. Review the Agent trade-off analysis and click **APPROVE**.
4. The system will dispatch a Corporate Action.
5. Open **DECIDR Personal** (`http://localhost:3000/corporate`).
6. Observe the incoming action (e.g. "Security Upskilling") intelligently adapted to the personal constraints.
7. Click **ACCEPT**.
8. Return to **DECIDR Organization** to see the privacy-safe aggregated outcomes update in real time.

---

## 🛡 Privacy Architecture

DECIDR enforces a strict boundary between organizational visibility and individual privacy.
- Personal data (sleep, schedule, private tasks) NEVER leaves the `DECIDR Personal Mode` backend.
- The `DECIDR Organization Mode` only receives aggregate numbers (e.g. `high_workload_rate = 0.58`) matching a minimum privacy threshold size.
