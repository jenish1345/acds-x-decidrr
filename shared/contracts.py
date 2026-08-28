"""Shared Integration Schema and Decision Contracts between Organization Mode and Personal Mode."""
# integration_version used by both backends for contract versioning
integration_version = "v1"

from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime

class Organization(BaseModel):
    organization_id: str
    name: str

class Department(BaseModel):
    department_id: str
    organization_id: str
    name: str

class DecisionContract(BaseModel):
    """The central communication artifact between Organization Agents and Personal Agents."""
    contract_id: str
    correlation_id: str
    objective: str
    required_outcome: str
    duration_minutes: int
    deadline: str
    priority: Literal["critical", "high", "medium", "low"] = "high"
    estimated_attention_cost: int = 4  # Scale 1-10 (e.g. 1=quick approval, 4=asynchronous training, 8=meeting, 9=deep work)
    
    organization_constraints: Dict[str, Any] = {
        "mandatory": True,
        "department": "Engineering",
        "grace_period_hours": 48
    }
    
    personal_agent_authority: Dict[str, bool] = {
        "can_reschedule": True,
        "can_split": True,
        "can_defer": True,
        "can_counterpropose": True
    }
    
    privacy_scope: Dict[str, Any] = {
        "individual_data_shared": False,
        "aggregate_only": True,
        "min_group_size": 10
    }
    
    provenance: Dict[str, Any] = {
        "created_by": "DECIDR Orchestrator Swarm",
        "reason": "Engineering recovery risk (46%) and elevated workload (58%) requires targeted upskilling block.",
        "confidence": 0.88,
        "agent_consensus": "Balanced Intervention"
    }

class CorporateAction(BaseModel):
    action_id: str
    organization_id: str
    department: str
    action_type: str
    title: str
    description: str = ""
    duration_minutes: int
    priority: Literal["critical", "high", "medium", "low"] = "medium"
    deadline: str
    reason: str = ""
    minimum_completion: bool = True
    correlation_id: str = ""
    contract: Optional[DecisionContract] = None

class AggregateWorkforceSignal(BaseModel):
    organization_id: str
    department: str
    period: str
    employee_count: int
    high_workload_rate: float
    high_recovery_risk_rate: float
    schedule_conflict_rate: float
    task_completion_rate: float

class AgentPosition(BaseModel):
    agent_name: str
    position: str
    impact: str
    confidence: float
    trade_off: int

class CorporateRecommendation(BaseModel):
    recommendation_id: str
    correlation_id: str = ""
    title: str
    evidence: List[str]
    agent_positions: List[AgentPosition] = []
    conflict_detected: str = ""
    recommendation_text: str
    expected_impact: str
    confidence: float
    trade_offs: Dict[str, int]
    contract: Optional[DecisionContract] = None

class PersonalConstitutionRule(BaseModel):
    rule_id: str
    name: str
    policy: Literal["ALLOW", "MODIFY", "ASK", "BLOCK", "COUNTERPROPOSE"]
    description: str
    enabled: bool = True

class AttentionBudget(BaseModel):
    daily_budget_points: int = 10
    spent_points: int = 4
    available_points: int = 6
    shield_status: Literal["PROTECTED", "ELEVATED_LOAD", "OVERLOAD_BLOCKED"] = "PROTECTED"

class EmployeeActionAssignment(BaseModel):
    assignment_id: str
    action_id: str
    user_id: str
    status: Literal["PENDING", "ACCEPTED", "MODIFIED", "DEFERRED", "REJECTED_WITH_REASON", "COUNTERPROPOSED"]
    scheduled_slot: Optional[str] = None
    reason: Optional[str] = None
    contract: Optional[DecisionContract] = None
    counterproposal: Optional[Dict[str, Any]] = None
    attention_cost: int = 4

class ActionOutcome(BaseModel):
    action_id: str
    correlation_id: str = ""
    department: str
    assigned: int
    accepted: int
    modified: int
    completed: int
    deferred: int
    skipped: int
    projected_burnout_reduction: str = "12%"

class DecisionTraceStep(BaseModel):
    step_number: int
    timestamp: str
    stage: str
    actor: str
    summary: str
    details: Dict[str, Any]

class DecisionTrace(BaseModel):
    trace_id: str
    correlation_id: str
    created_at: str
    steps: List[DecisionTraceStep]


class IntegrationEvent(BaseModel):
    """Lightweight audit event for the correlation/provenance trail."""
    event_id: str
    event_type: str
    timestamp: str
    source: str
    organization_id: str
    department: str
    correlation_id: str
    payload: Dict[str, Any] = {}
