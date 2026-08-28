"""Shared Pydantic models for agent communication (A2A protocol)."""

from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


# ── Enums ──────────────────────────────────────────────────────────

class Priority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class ConstraintType(str, Enum):
    HARD = "hard"        # must not be violated (e.g. minimum sleep)
    SOFT = "soft"        # can be adjusted (e.g. workout length)
    FLEXIBLE = "flexible"  # can be dropped entirely


# ── Input models ───────────────────────────────────────────────────

class ExamInfo(BaseModel):
    subject: str
    date: datetime
    difficulty: int = Field(ge=1, le=10, description="1=easy, 10=hardest")
    study_hours_needed: float = Field(ge=0, description="Estimated hours of study still required")
    priority: Priority = Priority.HIGH


class WorkoutInfo(BaseModel):
    activity: str = "General Training"
    planned_duration_min: int = Field(ge=0, description="Planned duration in minutes")
    intensity: int = Field(ge=1, le=10, description="1=light, 10=max effort")
    is_competition_prep: bool = False
    priority: Priority = Priority.MEDIUM


class SleepInfo(BaseModel):
    desired_hours: float = Field(ge=4, le=12, default=8)
    min_acceptable_hours: float = Field(ge=4, le=12, default=7)
    bedtime_preference: Optional[str] = "22:00"
    constraint_type: ConstraintType = ConstraintType.HARD


class GoalInfo(BaseModel):
    description: str
    category: str = "general"  # academic, fitness, recovery, personal
    importance: int = Field(ge=1, le=10, default=5)


class UserContext(BaseModel):
    """Full payload sent to each specialist agent."""
    user_id: str
    current_date: datetime
    exams: list[ExamInfo] = []
    workouts: list[WorkoutInfo] = []
    sleep: SleepInfo = SleepInfo()
    goals: list[GoalInfo] = []
    available_hours: float = Field(ge=0, default=16, description="Waking hours available today")
    notes: Optional[str] = None


# ── Agent response models ─────────────────────────────────────────

class AgentSuggestion(BaseModel):
    """Single suggestion from a specialist agent."""
    action: str                          # e.g. "reduce_workout"
    detail: str                          # e.g. "Cut from 70 to 30 min"
    reasoning: str                       # why this is recommended
    confidence: float = Field(ge=0, le=1)
    priority: Priority = Priority.MEDIUM
    time_impact_hours: float = 0         # net hours saved/consumed


class AgentResponse(BaseModel):
    """Standard response from any specialist agent."""
    agent_name: str
    domain: str                          # academic, fitness, recovery, schedule
    suggestions: list[AgentSuggestion]
    constraints_flagged: list[str] = []  # any hard constraints that were triggered
    summary: str


# ── Decision engine output ────────────────────────────────────────

class PlanBlock(BaseModel):
    """A single block in the generated plan."""
    time_slot: Optional[str] = None      # e.g. "06:00–07:00"
    activity: str
    duration_min: int
    rationale: str
    adjusted_from: Optional[str] = None  # original plan if changed


class DecisionPlan(BaseModel):
    """Final output of the decision engine."""
    user_id: str
    generated_at: datetime
    plan_blocks: list[PlanBlock]
    hard_constraints_honoured: list[str]
    trade_offs_made: list[str]
    overall_reasoning: str
    confidence: float = Field(ge=0, le=1)
    agent_contributions: list[AgentResponse]
