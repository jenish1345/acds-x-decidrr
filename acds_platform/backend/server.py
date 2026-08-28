"""ACDS Backend - Corporate Agents and Integration API."""

import sys
import os
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from shared.contracts import (
    AggregateWorkforceSignal,
    CorporateRecommendation,
    CorporateAction,
    IntegrationEvent,
    ActionOutcome
)

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from datetime import datetime
import uuid
import httpx

from agents import finance, people, operations, orchestrator

app = FastAPI(title="DECIDR Organization Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Databases
DB_SIGNALS: Dict[str, AggregateWorkforceSignal] = {}
DB_RECOMMENDATIONS: Dict[str, CorporateRecommendation] = {}
DB_ACTIONS: Dict[str, CorporateAction] = {}
DB_OUTCOMES: Dict[str, ActionOutcome] = {}
DB_EVENTS: List[IntegrationEvent] = []

DECIDR_URL = "http://localhost:8000"

def log_event(event_type: str, source: str, org_id: str, dept: str, correlation_id: str, payload: dict = {}):
    event = IntegrationEvent(
        event_id=str(uuid.uuid4()),
        event_type=event_type,
        timestamp=datetime.utcnow().isoformat() + "Z",
        source=source,
        organization_id=org_id,
        department=dept,
        correlation_id=correlation_id,
        payload=payload
    )
    DB_EVENTS.append(event)
    print(f"[{event.timestamp}] {source} - {event_type} - {correlation_id}")

@app.get("/health")
def health():
    return {"status": "ok", "service": "decidr-organization-backend"}

@app.post("/api/integration/decidr/aggregate")
def receive_aggregate_signal(signal: AggregateWorkforceSignal):
    """Receive privacy-safe aggregated signals from Decidr."""
    key = f"{signal.organization_id}_{signal.department}"
    DB_SIGNALS[key] = signal
    
    log_event(
        event_type="AGGREGATE_SIGNAL_RECEIVED",
        source="ACDS",
        org_id=signal.organization_id,
        dept=signal.department,
        correlation_id="none",
        payload={"employee_count": signal.employee_count}
    )
    return {"status": "success"}

@app.get("/api/integration/organization/{org_id}/department/{dept}/signal")
def get_latest_signal(org_id: str, dept: str):
    key = f"{org_id}_{dept}"
    if key not in DB_SIGNALS:
        return AggregateWorkforceSignal(
            organization_id=org_id,
            department=dept,
            period="2026-W35",
            employee_count=24,
            high_workload_rate=0.58,
            high_recovery_risk_rate=0.46,
            schedule_conflict_rate=0.38,
            task_completion_rate=0.81
        )
    return DB_SIGNALS[key]

@app.post("/api/integration/acds/recommendation", response_model=CorporateRecommendation)
def generate_recommendation(signal: AggregateWorkforceSignal):
    """Trigger corporate agents to evaluate the signal and generate a recommendation."""
    log_event("ORGANIZATIONAL_RISK_DETECTED", "ACDS", signal.organization_id, signal.department, "pending")
    
    fin_finding = finance.evaluate(signal)
    peop_finding = people.evaluate(signal)
    ops_finding = operations.evaluate(signal)
    
    rec_data = orchestrator.orchestrate_agents(fin_finding, peop_finding, ops_finding)
    
    rec = CorporateRecommendation(
        recommendation_id=f"REC-{uuid.uuid4().hex[:6].upper()}",
        title=rec_data["title"],
        evidence=rec_data["evidence"],
        recommendation_text=rec_data["recommendation_text"],
        expected_impact=rec_data["expected_impact"],
        confidence=rec_data["confidence"],
        trade_offs=rec_data["trade_offs"]
    )
    
    DB_RECOMMENDATIONS[rec.recommendation_id] = rec
    log_event("CORPORATE_RECOMMENDATION_CREATED", "ACDS", signal.organization_id, signal.department, "pending", {"rec_id": rec.recommendation_id})
    return rec

@app.post("/api/integration/acds/approve_action")
async def approve_action(rec_id: str, org_id: str, dept: str):
    """Executive approves the recommendation. Action is dispatched to Decidr."""
    if rec_id not in DB_RECOMMENDATIONS:
        raise HTTPException(status_code=404, detail="Recommendation not found")
        
    rec = DB_RECOMMENDATIONS[rec_id]
    correlation_id = f"campaign_{datetime.utcnow().strftime('%Y_%m_%d_%H%M')}"
    
    action = CorporateAction(
        action_id=f"CA-{uuid.uuid4().hex[:6].upper()}",
        organization_id=org_id,
        department=dept,
        action_type="training",
        title="Engineering Upskilling",
        description=rec.title,
        duration_minutes=60,
        priority="high",
        deadline="2026-09-04T17:00:00Z",
        reason=rec.recommendation_text,
        minimum_completion=True,
        correlation_id=correlation_id
    )
    
    DB_ACTIONS[action.action_id] = action
    log_event("CORPORATE_ACTION_APPROVED", "Executive", org_id, dept, correlation_id, {"action_id": action.action_id})
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(f"{DECIDR_URL}/api/corporate/actions", json=action.model_dump())
            resp.raise_for_status()
            log_event("CORPORATE_ACTION_DISPATCHED", "Integration", org_id, dept, correlation_id, {"action_id": action.action_id})
        except Exception as e:
            log_event("CORPORATE_ACTION_DISPATCH_FAILED", "Integration", org_id, dept, correlation_id, {"error": str(e)})
            raise HTTPException(status_code=502, detail=f"Failed to dispatch to Decidr: {str(e)}")
            
    return {"status": "success", "action": action}

@app.post("/api/integration/acds/action/{action_id}/outcome")
def receive_outcome(action_id: str, outcome: ActionOutcome):
    """Receive the aggregated outcome from Decidr."""
    DB_OUTCOMES[action_id] = outcome
    
    action = DB_ACTIONS.get(action_id)
    org_id = action.organization_id if action else "unknown"
    dept = outcome.department
    correlation_id = action.correlation_id if action else "unknown"
    
    log_event("AGGREGATE_OUTCOME_REPORTED", "Integration", org_id, dept, correlation_id, {"action_id": action_id})
    log_event("ORGANIZATIONAL_RISK_REEVALUATED", "ACDS", org_id, dept, correlation_id)
    
    return {"status": "success"}

@app.get("/api/integration/acds/action/{action_id}/outcome")
def get_outcome(action_id: str):
    return DB_OUTCOMES.get(action_id)

@app.get("/api/integration/events")
def get_events():
    return DB_EVENTS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
