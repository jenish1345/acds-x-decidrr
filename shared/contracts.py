"""Shared Integration Schema between ACDS and Decidr."""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

integration_version = "v1"

class Organization(BaseModel):
    organization_id: str
    name: str

class Department(BaseModel):
    department_id: str
    organization_id: str
    name: str

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

class AggregateWorkforceSignal(BaseModel):
    organization_id: str
    department: str
    period: str
    employee_count: int
    high_workload_rate: float
    high_recovery_risk_rate: float
    schedule_conflict_rate: float
    task_completion_rate: float

class CorporateRecommendation(BaseModel):
    recommendation_id: str
    title: str
    evidence: List[str]
    recommendation_text: str
    expected_impact: str
    confidence: float
    trade_offs: dict

class EmployeeActionAssignment(BaseModel):
    assignment_id: str
    action_id: str
    user_id: str
    status: Literal["PENDING", "ACCEPTED", "MODIFIED", "DEFERRED", "REJECTED_WITH_REASON"]
    scheduled_slot: Optional[str] = None
    reason: Optional[str] = None

class ActionOutcome(BaseModel):
    action_id: str
    department: str
    assigned: int
    accepted: int
    modified: int
    completed: int
    deferred: int
    skipped: int

class IntegrationEvent(BaseModel):
    event_id: str
    event_type: str
    timestamp: str
    source: str
    organization_id: str
    department: str
    correlation_id: str
    payload: dict = {}
