"""DECIDR Personal Mode - Corporate Action Ingestion, Personal Constitution & Attention Shield."""

import sys
import os
import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from shared.contracts import (
    CorporateAction,
    EmployeeActionAssignment,
    PersonalConstitutionRule,
    AttentionBudget,
    DecisionContract
)

# In-memory storage for personal state
DB_CORPORATE_ACTIONS: Dict[str, CorporateAction] = {}
DB_ASSIGNMENTS: Dict[str, EmployeeActionAssignment] = {}
DB_CONSTITUTION: List[PersonalConstitutionRule] = [
    PersonalConstitutionRule(
        rule_id="rule-01",
        name="Academic Priority Shield",
        policy="COUNTERPROPOSE",
        description="Academic deadlines within 24h override optional corporate scheduling.",
        enabled=True
    ),
    PersonalConstitutionRule(
        rule_id="rule-02",
        name="Minimum Sleep Protection",
        policy="BLOCK",
        description="No task scheduling after 10:00 PM if total sleep is under 7 hours.",
        enabled=True
    ),
    PersonalConstitutionRule(
        rule_id="rule-03",
        name="Daily Attention Budget Cap",
        policy="MODIFY",
        description="Maximum 6 high-focus attention points per day.",
        enabled=True
    )
]

CURRENT_ATTENTION_BUDGET = AttentionBudget(
    daily_budget_points=10,
    spent_points=4,
    available_points=6,
    shield_status="PROTECTED"
)

def receive_corporate_action(action: CorporateAction):
    """Receive a Corporate Action with its Decision Contract and evaluate it against personal constraints."""
    # Idempotency check
    if action.action_id in DB_CORPORATE_ACTIONS:
        existing_assignment_id = next(
            (a.assignment_id for a in DB_ASSIGNMENTS.values() if a.action_id == action.action_id),
            None
        )
        return {"status": "already_exists", "action_id": action.action_id, "assignment_id": existing_assignment_id}
        
    DB_CORPORATE_ACTIONS[action.action_id] = action
    
    # Assign to demo employee (Arun)
    user_id = "user_arun_fernando"
    assignment_id = f"ASSIGN-{uuid.uuid4().hex[:6].upper()}"
    
    # Perform Personal AI Evaluation & Attention Shielding
    attention_cost = action.contract.estimated_attention_cost if action.contract else 4
    
    # Check Personal Constitution
    # Wednesday has Computer Science exam preparation -> Trigger Counterproposal
    counterproposal = {
        "original_requested": "Wednesday 3:00-4:00 PM",
        "proposed_slot": "Thursday 7:00-8:00 PM",
        "attention_cost": attention_cost,
        "constitution_rule_triggered": "Academic Priority Shield (Rule #01)",
        "shield_verdict": "Attention Shielded: Wednesday has 8/10 load from CS Exam prep. Thursday has 3/10 load with full 6h recovery window.",
        "reasons": [
            "Wednesday 3:00 PM directly conflicts with CS Semester Exam preparation threshold.",
            "Thursday 7:00 PM fits within the daily 6-point attention budget.",
            "Full compliance with organizational deadline (Friday 5:00 PM) preserved.",
            "Recovery baseline of 7.5h sleep remains completely untouched."
        ]
    }
    
    assignment = EmployeeActionAssignment(
        assignment_id=assignment_id,
        action_id=action.action_id,
        user_id=user_id,
        status="COUNTERPROPOSED",
        scheduled_slot="Thursday 7:00-8:00 PM",
        reason="Academic priority shield triggered. Rescheduled to Thursday evening to protect exam preparation.",
        contract=action.contract,
        counterproposal=counterproposal,
        attention_cost=attention_cost
    )
    
    DB_ASSIGNMENTS[assignment_id] = assignment
    
    return {
        "status": "success",
        "assignment_id": assignment_id,
        "counterproposal": counterproposal
    }

def get_personal_constitution():
    return DB_CONSTITUTION

def get_attention_budget():
    return CURRENT_ATTENTION_BUDGET

def evaluate_personal_adaptation(assignment_id: str):
    """Retrieve full evaluation context for personal corporate task view."""
    if assignment_id not in DB_ASSIGNMENTS:
        return None
        
    assignment = DB_ASSIGNMENTS[assignment_id]
    action = DB_CORPORATE_ACTIONS.get(assignment.action_id)
    
    return {
        "assignment_id": assignment_id,
        "action": action,
        "status": assignment.status,
        "contract": assignment.contract,
        "counterproposal": assignment.counterproposal,
        "attention_cost": assignment.attention_cost,
        "scheduled_slot": assignment.scheduled_slot,
        "reasoning": assignment.counterproposal.get("reasons", []) if assignment.counterproposal else [
            "Protected around personal goals",
            "Sufficient time window available"
        ]
    }

def update_assignment_status(assignment_id: str, status: str, scheduled_slot: str = None, reason: str = None):
    """Update assignment status when user accepts, modifies, or defers."""
    if assignment_id in DB_ASSIGNMENTS:
        DB_ASSIGNMENTS[assignment_id].status = status
        if scheduled_slot:
            DB_ASSIGNMENTS[assignment_id].scheduled_slot = scheduled_slot
        if reason:
            DB_ASSIGNMENTS[assignment_id].reason = reason
            
        # Update attention budget points if accepted
        if status in ["ACCEPTED", "COUNTERPROPOSAL_ACCEPTED"]:
            CURRENT_ATTENTION_BUDGET.spent_points += DB_ASSIGNMENTS[assignment_id].attention_cost
            CURRENT_ATTENTION_BUDGET.available_points = max(0, CURRENT_ATTENTION_BUDGET.daily_budget_points - CURRENT_ATTENTION_BUDGET.spent_points)
            
        return True
    return False

def get_all_assignments():
    return [evaluate_personal_adaptation(a_id) for a_id in DB_ASSIGNMENTS]
