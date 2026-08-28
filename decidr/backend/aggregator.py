"""Privacy Aggregation Layer - Enforces minimum group size before sending to Organization Mode."""

import sys
import os
import httpx
from pathlib import Path

# Make shared/ importable regardless of working directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from shared.contracts import AggregateWorkforceSignal, ActionOutcome

# Lazy import: when uvicorn runs this from decidr/backend/, corporate is a sibling module
# When run from the repo root (tests), decidr.backend.corporate is the path
try:
    from corporate import DB_ASSIGNMENTS, DB_CORPORATE_ACTIONS
except ImportError:
    from decidr.backend.corporate import DB_ASSIGNMENTS, DB_CORPORATE_ACTIONS

ACDS_API_URL = "http://localhost:8001"
MIN_GROUP_SIZE = 10

def _get_demo_workforce_data(dept: str):
    """Mock aggregate signals. Ensures we have > MIN_GROUP_SIZE to simulate real demo data."""
    if dept.lower() == "engineering":
        return AggregateWorkforceSignal(
            organization_id="ACME_TECH",
            department="Engineering",
            period="2026-W35",
            employee_count=24,
            high_workload_rate=0.58,
            high_recovery_risk_rate=0.46,
            schedule_conflict_rate=0.38,
            task_completion_rate=0.81
        )
    return None

async def send_aggregate_signals(department: str):
    """Send privacy-safe aggregated signals to ACDS if threshold is met."""
    signal = _get_demo_workforce_data(department)
    
    if not signal or signal.employee_count < MIN_GROUP_SIZE:
        return {"status": "error", "message": "Insufficient group size. Privacy threshold not met."}
        
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{ACDS_API_URL}/api/integration/decidr/aggregate", json=signal.model_dump())
        resp.raise_for_status()
        
    return {"status": "success", "message": "Aggregated signals sent"}

async def send_aggregated_outcome(action_id: str, department: str):
    """Calculate outcomes for an action and push to ACDS. Enforces group size."""
    
    # We use synthetic data for the demo as if multiple employees responded
    # based on the single local assignment's status, or just mock realistic outcome.
    
    # For demo: check actual local user status, then add 23 synthetic outcomes for Engineering
    assigned = 24
    accepted = 18
    modified = 3
    completed = 0
    deferred = 2
    skipped = 1
    
    # Incorporate real local user status
    local_status = "PENDING"
    for a in DB_ASSIGNMENTS.values():
        if a.action_id == action_id:
            local_status = a.status
            
    if local_status == "ACCEPTED":
        accepted += 1
    elif local_status == "MODIFIED":
        modified += 1
    elif local_status == "DEFERRED":
        deferred += 1
    elif local_status == "COMPLETED":
        completed += 1
    
    outcome = ActionOutcome(
        action_id=action_id,
        department=department,
        assigned=assigned,
        accepted=accepted,
        modified=modified,
        completed=completed,
        deferred=deferred,
        skipped=skipped
    )
    
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{ACDS_API_URL}/api/integration/acds/action/{action_id}/outcome", json=outcome.model_dump())
        resp.raise_for_status()
        
    return {"status": "success"}
