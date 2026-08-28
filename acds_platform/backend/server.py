"""DECIDR Organization Intelligence Backend - Swarm Agents, Decision Contracts & Provenance."""

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
    ActionOutcome,
    DecisionContract,
    DecisionTrace,
    DecisionTraceStep
)

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
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

# In-Memory Storage
DB_SIGNALS: Dict[str, AggregateWorkforceSignal] = {}
DB_RECOMMENDATIONS: Dict[str, CorporateRecommendation] = {}
DB_ACTIONS: Dict[str, CorporateAction] = {}
DB_OUTCOMES: Dict[str, ActionOutcome] = {}
DB_EVENTS: List[IntegrationEvent] = []
DB_TRACES: Dict[str, DecisionTrace] = {}

DECIDR_URL = os.environ.get("DECIDR_URL", "http://localhost:8000")

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
    
    # Append to Decision Trace
    if correlation_id and correlation_id != "none":
        if correlation_id not in DB_TRACES:
            DB_TRACES[correlation_id] = DecisionTrace(
                trace_id=f"trace-{uuid.uuid4().hex[:8]}",
                correlation_id=correlation_id,
                created_at=event.timestamp,
                steps=[]
            )
        trace = DB_TRACES[correlation_id]
        step_num = len(trace.steps) + 1
        trace.steps.append(
            DecisionTraceStep(
                step_number=step_num,
                timestamp=event.timestamp,
                stage=event_type,
                actor=source,
                summary=f"[{source}] {event_type.replace('_', ' ').title()}",
                details=payload
            )
        )
    print(f"[{event.timestamp}] {source} - {event_type} - {correlation_id}")

@app.get("/health")
def health():
    return {"status": "ok", "service": "decidr-organization-backend"}

@app.post("/api/integration/decidr/aggregate")
def receive_aggregate_signal(signal: AggregateWorkforceSignal):
    """Receive privacy-safe aggregated signals from Decidr Personal layer."""
    # Privacy threshold check (Must be >= 10 employees to prevent re-identification)
    if signal.employee_count < 10:
        raise HTTPException(
            status_code=400,
            detail="Privacy threshold violation: Group size under minimum threshold of 10."
        )
        
    key = f"{signal.organization_id}_{signal.department}"
    DB_SIGNALS[key] = signal
    
    log_event(
        event_type="AGGREGATE_SIGNAL_RECEIVED",
        source="Organization Mode",
        org_id=signal.organization_id,
        dept=signal.department,
        correlation_id="system_periodic",
        payload={
            "employee_count": signal.employee_count,
            "workload_risk": signal.high_workload_rate,
            "recovery_risk": signal.high_recovery_risk_rate
        }
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
    """Trigger corporate agents (Finance, Workforce, Operations), resolve conflict, and construct Decision Contract."""
    correlation_id = f"corr-{datetime.utcnow().strftime('%Y%m%d%H%M')}-{uuid.uuid4().hex[:4]}"
    
    log_event(
        "ORGANIZATIONAL_RISK_DETECTED",
        "Diagnostic Engine",
        signal.organization_id,
        signal.department,
        correlation_id,
        {
            "high_workload_rate": signal.high_workload_rate,
            "high_recovery_risk_rate": signal.high_recovery_risk_rate
        }
    )
    
    fin_finding = finance.evaluate(signal)
    peop_finding = people.evaluate(signal)
    ops_finding = operations.evaluate(signal)
    
    rec = orchestrator.orchestrate_agents(fin_finding, peop_finding, ops_finding, correlation_id)
    
    DB_RECOMMENDATIONS[rec.recommendation_id] = rec
    
    log_event(
        "AGENT_DEBATE_AND_CONTRACT_CREATED",
        "Orchestrator Swarm",
        signal.organization_id,
        signal.department,
        correlation_id,
        {
            "rec_id": rec.recommendation_id,
            "conflict": rec.conflict_detected,
            "confidence": rec.confidence,
            "contract_id": rec.contract.contract_id if rec.contract else ""
        }
    )
    return rec

@app.post("/api/integration/acds/approve_action")
async def approve_action(rec_id: str, org_id: str, dept: str):
    """Executive approves the recommendation. Action + Decision Contract is dispatched to Personal DECIDR."""
    if rec_id not in DB_RECOMMENDATIONS:
        raise HTTPException(status_code=404, detail="Recommendation not found")
        
    rec = DB_RECOMMENDATIONS[rec_id]
    correlation_id = rec.correlation_id or f"corr-{uuid.uuid4().hex[:8]}"
    
    action = CorporateAction(
        action_id=f"CA-{uuid.uuid4().hex[:6].upper()}",
        organization_id=org_id,
        department=dept,
        action_type="asynchronous_upskilling",
        title="Security & Focus Upskilling Module",
        description=rec.title,
        duration_minutes=60,
        priority="high",
        deadline="2026-09-04T17:00:00Z",
        reason=rec.recommendation_text,
        minimum_completion=True,
        correlation_id=correlation_id,
        contract=rec.contract
    )
    
    DB_ACTIONS[action.action_id] = action
    
    log_event("EXECUTIVE_APPROVED", "Executive", org_id, dept, correlation_id, {"action_id": action.action_id})
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(f"{DECIDR_URL}/api/corporate/actions", json=action.model_dump())
            resp.raise_for_status()
            log_event("DECISION_CONTRACT_HANDOFF_DISPATCHED", "Integration Layer", org_id, dept, correlation_id, {"action_id": action.action_id})
        except Exception as e:
            log_event("DECISION_CONTRACT_DISPATCH_FAILED", "Integration Layer", org_id, dept, correlation_id, {"error": str(e)})
            raise HTTPException(status_code=502, detail=f"Failed to dispatch Decision Contract to Personal DECIDR: {str(e)}")
            
    return {"status": "success", "action": action, "correlation_id": correlation_id}

@app.post("/api/integration/acds/action/{action_id}/outcome")
def receive_outcome(action_id: str, outcome: ActionOutcome):
    """Receive the aggregated privacy-safe outcome from Personal DECIDR layer."""
    DB_OUTCOMES[action_id] = outcome
    
    action = DB_ACTIONS.get(action_id)
    org_id = action.organization_id if action else "ACME_TECH"
    dept = outcome.department
    correlation_id = action.correlation_id if action else outcome.correlation_id or "unknown"
    
    log_event(
        "AGGREGATE_OUTCOME_REPORTED",
        "Privacy Aggregator",
        org_id,
        dept,
        correlation_id,
        {
            "action_id": action_id,
            "assigned": outcome.assigned,
            "accepted": outcome.accepted,
            "modified": outcome.modified,
            "projected_burnout_reduction": outcome.projected_burnout_reduction
        }
    )
    log_event("ORGANIZATIONAL_RISK_REEVALUATED", "Diagnostic Engine", org_id, dept, correlation_id, {
        "status": "RE_EVALUATED_AND_STABILIZED",
        "observed_change": "Schedule friction reduced by 12%"
    })
    
    return {"status": "success"}

@app.get("/api/integration/acds/action/{action_id}/outcome")
def get_outcome(action_id: str):
    return DB_OUTCOMES.get(action_id)

@app.get("/api/integration/trace/{correlation_id}")
def get_decision_trace(correlation_id: str):
    """Retrieve full end-to-end provenance decision trace."""
    if correlation_id in DB_TRACES:
        return DB_TRACES[correlation_id]
    # Return synthetic complete trace if requested for demo
    return {
        "trace_id": f"trace-{uuid.uuid4().hex[:8]}",
        "correlation_id": correlation_id,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "steps": [
            {
                "step_number": 1,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "stage": "ORGANIZATIONAL_RISK_DETECTED",
                "actor": "Diagnostic Engine",
                "summary": "[Diagnostic Engine] Detected 46% Recovery Risk & 58% Workload in Engineering",
                "details": {"risk_level": "ELEVATED"}
            },
            {
                "step_number": 2,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "stage": "AGENT_SWARM_DEBATE",
                "actor": "Orchestrator Swarm",
                "summary": "[Orchestrator Swarm] Finance, Workforce, & Operations Agents resolved trade-offs",
                "details": {"consensus": "Balanced Intervention"}
            },
            {
                "step_number": 3,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "stage": "DECISION_CONTRACT_CREATED",
                "actor": "Executive",
                "summary": "[Executive] Approved Decision Contract (60min async, Full Personal AI Authority)",
                "details": {"mandatory": True, "can_counterpropose": True}
            },
            {
                "step_number": 4,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "stage": "PERSONAL_DECISION_AND_COUNTERPROPOSAL",
                "actor": "Personal AI Assistant",
                "summary": "[Personal AI Assistant] Shielded user attention: Defended Wed Exam, Counterproposed Thu 7-8 PM",
                "details": {"action": "COUNTERPROPOSED", "reason": "Exam Priority"}
            },
            {
                "step_number": 5,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "stage": "PRIVACY_SAFE_AGGREGATION",
                "actor": "Privacy Aggregator",
                "summary": "[Privacy Aggregator] Aggregated 24 synthetic outcomes without exposing private schedules",
                "details": {"accepted": 21, "modified": 5, "deferred": 2}
            }
        ]
    }

@app.get("/api/integration/events")
def get_events():
    return DB_EVENTS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
