"""Schedule Agent – computes available time slots and feasible sequencing."""

from __future__ import annotations
from models import (
    UserContext, AgentResponse, AgentSuggestion, Priority
)


def evaluate(ctx: UserContext) -> AgentResponse:
    """Build a time-slot matrix and flag scheduling conflicts."""
    suggestions: list[AgentSuggestion] = []
    constraints: list[str] = []

    # ── Sum up all time demands ───────────────────────────────
    sleep_hours = ctx.sleep.desired_hours
    study_hours = sum(e.study_hours_needed for e in ctx.exams)
    workout_hours = sum(w.planned_duration_min / 60 for w in ctx.workouts)
    total_demand = sleep_hours + study_hours + workout_hours
    available = ctx.available_hours
    slack = available - total_demand

    # ── Conflict detection ────────────────────────────────────
    if slack < 0:
        constraints.append(
            f"Schedule OVERLOADED by {abs(slack):.1f} h — adjustments required"
        )
        suggestions.append(
            AgentSuggestion(
                action="schedule_conflict",
                detail=(
                    f"Total demand ({total_demand:.1f} h) exceeds available time ({available:.1f} h) "
                    f"by {abs(slack):.1f} h. Something must be reduced or dropped."
                ),
                reasoning=(
                    "The schedule is physically impossible as planned. "
                    "The decision engine should prioritise hard constraints (sleep), "
                    "then high-priority activities (exams), then adjust remaining items."
                ),
                confidence=0.95,
                priority=Priority.CRITICAL,
                time_impact_hours=slack,  # negative
            )
        )
    elif slack < 2:
        suggestions.append(
            AgentSuggestion(
                action="schedule_tight",
                detail=(
                    f"Only {slack:.1f} h of slack. Schedule is tight but feasible."
                ),
                reasoning=(
                    "Minimal buffer for transitions, meals, and unexpected events. "
                    "Recommend keeping transitions to ≤15 min between activities."
                ),
                confidence=0.8,
                priority=Priority.MEDIUM,
                time_impact_hours=0,
            )
        )
    else:
        suggestions.append(
            AgentSuggestion(
                action="schedule_comfortable",
                detail=f"{slack:.1f} h of free time available after all commitments.",
                reasoning="Comfortable schedule. Use free time for active recovery or personal goals.",
                confidence=0.9,
                priority=Priority.LOW,
                time_impact_hours=0,
            )
        )

    # ── Sequencing recommendations ────────────────────────────
    # Prefer: workout early → study blocks → wind-down → sleep
    has_morning_workout = any(w.intensity <= 6 for w in ctx.workouts)
    has_heavy_study = study_hours >= 3

    if has_heavy_study and has_morning_workout:
        suggestions.append(
            AgentSuggestion(
                action="sequence_recommendation",
                detail="Workout first (morning), then study blocks, then wind-down before bed.",
                reasoning=(
                    "Research shows moderate exercise before study improves focus and "
                    "retention. Placing the workout first front-loads physical energy "
                    "and leaves the afternoon for cognitive work."
                ),
                confidence=0.8,
                priority=Priority.MEDIUM,
                time_impact_hours=0,
            )
        )
    elif has_heavy_study:
        suggestions.append(
            AgentSuggestion(
                action="sequence_recommendation",
                detail="Start with the hardest study block, take 15-min breaks between blocks.",
                reasoning=(
                    "Cognitive performance peaks in the first 2–3 hours after waking. "
                    "Tackle the most difficult subject first."
                ),
                confidence=0.75,
                priority=Priority.MEDIUM,
                time_impact_hours=0,
            )
        )

    return AgentResponse(
        agent_name="ScheduleAgent",
        domain="schedule",
        suggestions=suggestions,
        constraints_flagged=constraints,
        summary=(
            f"Demand: {total_demand:.1f} h | Available: {available:.1f} h | "
            f"Slack: {slack:.1f} h."
        ),
    )
