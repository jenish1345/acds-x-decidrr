"""Decidr Backend – FastAPI server exposing the A2A agent endpoints and decision engine."""

from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import UserContext, AgentResponse, DecisionPlan
from agents import academic, fitness, recovery, schedule
from decision_engine import decide

app = FastAPI(
    title="Decidr API",
    description="Personal Decision Agent for Student-Athletes",
    version="0.1.0",
)

# ── CORS (allow Next.js frontend) ────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health check ──────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "decidr-backend"}


# ── Individual agent endpoints (A2A protocol) ────────────────
@app.post("/agents/academic", response_model=AgentResponse)
def run_academic(ctx: UserContext):
    """Academic Agent – evaluates exam urgency and study requirements."""
    return academic.evaluate(ctx)


@app.post("/agents/fitness", response_model=AgentResponse)
def run_fitness(ctx: UserContext):
    """Fitness Agent – evaluates training importance and minimum viable workouts."""
    return fitness.evaluate(ctx)


@app.post("/agents/recovery", response_model=AgentResponse)
def run_recovery(ctx: UserContext):
    """Recovery Agent – protects sleep and fatigue-related recovery."""
    return recovery.evaluate(ctx)


@app.post("/agents/schedule", response_model=AgentResponse)
def run_schedule(ctx: UserContext):
    """Schedule Agent – checks available time and feasible sequencing."""
    return schedule.evaluate(ctx)


# ── Decision engine (orchestrates all agents) ─────────────────
@app.post("/decide", response_model=DecisionPlan)
def run_decide(ctx: UserContext):
    """Run all four agents, aggregate, enforce constraints, return plan."""
    return decide(ctx)


# ── B2B2C Integration Endpoints ───────────────────────────────
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../shared'))
from models import CorporateAction
from corporate import receive_corporate_action, get_all_assignments, update_assignment_status
from aggregator import send_aggregate_signals, send_aggregated_outcome

@app.post("/api/corporate/actions")
def ingest_corporate_action(action: CorporateAction):
    return receive_corporate_action(action)

@app.get("/api/corporate/assignments")
def list_assignments():
    return get_all_assignments()

@app.post("/api/corporate/assignments/{assignment_id}/status")
def update_status(assignment_id: str, status_update: dict):
    success = update_assignment_status(
        assignment_id, 
        status_update.get("status"), 
        status_update.get("scheduled_slot"), 
        status_update.get("reason")
    )
    return {"success": success}

@app.post("/api/integration/send_signals/{dept}")
async def trigger_send_signals(dept: str):
    return await send_aggregate_signals(dept)

@app.post("/api/integration/send_outcome/{action_id}/{dept}")
async def trigger_send_outcome(action_id: str, dept: str):
    return await send_aggregated_outcome(action_id, dept)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
