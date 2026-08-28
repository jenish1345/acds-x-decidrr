"""Corporate Action Ingestion and Personal Adaptation for Decidr."""

import sys
import os
import uuid
from typing import Dict
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '../../shared'))
from models import CorporateAction, EmployeeActionAssignment

# In-memory DB for corporate tasks (for demo)
DB_CORPORATE_ACTIONS: Dict[str, CorporateAction] = {}
DB_ASSIGNMENTS: Dict[str, EmployeeActionAssignment] = {}

def receive_corporate_action(action: CorporateAction):
    """Receive a corporate action and store it. Returns assignment id for current user."""
    # Idempotency check
    if action.action_id in DB_CORPORATE_ACTIONS:
        return {"status": "already_exists", "action_id": action.action_id}
        
    DB_CORPORATE_ACTIONS[action.action_id] = action
    
    # In a real system, this would iterate over employees. We'll assign it to our local user.
    user_id = "local_demo_user"
    assignment = EmployeeActionAssignment(
        assignment_id=f"ASSIGN-{uuid.uuid4().hex[:6].upper()}",
        action_id=action.action_id,
        user_id=user_id,
        status="PENDING",
        scheduled_slot=None
    )
    
    DB_ASSIGNMENTS[assignment.assignment_id] = assignment
    
    return {"status": "success", "assignment_id": assignment.assignment_id}

def evaluate_personal_adaptation(assignment_id: str):
    """Evaluate constraints and suggest a personal schedule for the corporate action."""
    if assignment_id not in DB_ASSIGNMENTS:
        return None
        
    assignment = DB_ASSIGNMENTS[assignment_id]
    action = DB_CORPORATE_ACTIONS[assignment.action_id]
    
    # Mock Decidr analysis
    # E.g., Wednesday has exams, Thursday is best.
    recommended_slot = "Thursday 7:00-8:00 PM"
    reasoning = [
        "Wednesday exam preparation is high priority",
        "Thursday has sufficient availability",
        "Recovery constraints remain satisfied"
    ]
    
    return {
        "assignment_id": assignment_id,
        "action": action,
        "recommended_slot": recommended_slot,
        "reasoning": reasoning
    }

def update_assignment_status(assignment_id: str, status: str, scheduled_slot: str = None, reason: str = None):
    """Update status when user Accepts, Modifies, or Defers."""
    if assignment_id in DB_ASSIGNMENTS:
        DB_ASSIGNMENTS[assignment_id].status = status
        DB_ASSIGNMENTS[assignment_id].scheduled_slot = scheduled_slot
        DB_ASSIGNMENTS[assignment_id].reason = reason
        return True
    return False

def get_all_assignments():
    return [evaluate_personal_adaptation(a_id) for a_id in DB_ASSIGNMENTS]
