"""Fitness Agent – evaluates workout importance and minimum viable sessions."""

from __future__ import annotations
from models import (
    UserContext, AgentResponse, AgentSuggestion, Priority
)


def evaluate(ctx: UserContext) -> AgentResponse:
    """Assess workouts and suggest adjustments based on overall time pressure."""
    suggestions: list[AgentSuggestion] = []
    constraints: list[str] = []

    # Calculate total academic pressure (hours demanded by exams)
    academic_pressure = sum(e.study_hours_needed for e in ctx.exams)
    sleep_hours = ctx.sleep.desired_hours
    free_hours = ctx.available_hours - sleep_hours - academic_pressure

    for wo in ctx.workouts:
        planned_min = wo.planned_duration_min
        intensity = wo.intensity

        # ── determine minimum viable workout ──────────────────
        if wo.is_competition_prep:
            # Competition prep is a harder constraint
            min_viable_min = max(int(planned_min * 0.7), 30)
            can_reduce = planned_min - min_viable_min
            priority = Priority.HIGH
        elif intensity >= 7:
            # High-intensity: can trim but still need meaningful session
            min_viable_min = max(int(planned_min * 0.5), 20)
            can_reduce = planned_min - min_viable_min
            priority = Priority.MEDIUM
        else:
            # Low-moderate: can be cut significantly or replaced with active recovery
            min_viable_min = max(int(planned_min * 0.3), 15)
            can_reduce = planned_min - min_viable_min
            priority = Priority.LOW

        # ── decide whether to trim ────────────────────────────
        if free_hours < 2 and not wo.is_competition_prep:
            # Severe time crunch → recommend minimum viable
            suggested_min = min_viable_min
            confidence = 0.9
            action = "reduce_workout"
            reasoning = (
                f"Only {free_hours:.1f} h free after sleep + study. "
                f"Reducing {wo.activity} from {planned_min} to {suggested_min} min "
                f"saves {can_reduce} min while maintaining training consistency."
            )
        elif free_hours < 4:
            # Moderate crunch → trim 25 %
            suggested_min = max(int(planned_min * 0.75), min_viable_min)
            confidence = 0.8
            action = "trim_workout"
            reasoning = (
                f"Moderate time pressure ({free_hours:.1f} h free). "
                f"Trimming {wo.activity} to {suggested_min} min preserves the training stimulus."
            )
        else:
            # Enough time → keep as planned
            suggested_min = planned_min
            confidence = 0.85
            action = "keep_workout"
            reasoning = (
                f"Sufficient free time ({free_hours:.1f} h). "
                f"Keep {wo.activity} at {planned_min} min as planned."
            )

        time_saved_hours = round((planned_min - suggested_min) / 60, 2)

        suggestions.append(
            AgentSuggestion(
                action=action,
                detail=f"{wo.activity}: {suggested_min} min (was {planned_min} min). Intensity {intensity}/10.",
                reasoning=reasoning,
                confidence=confidence,
                priority=priority,
                time_impact_hours=-time_saved_hours,  # negative = time freed
            )
        )

        if wo.is_competition_prep:
            constraints.append(
                f"{wo.activity} is competition-prep — cannot drop below {min_viable_min} min"
            )

    if not suggestions:
        suggestions.append(
            AgentSuggestion(
                action="no_workout_planned",
                detail="No workouts scheduled today.",
                reasoning="Consider active recovery if time allows.",
                confidence=0.9,
                priority=Priority.LOW,
                time_impact_hours=0,
            )
        )

    return AgentResponse(
        agent_name="FitnessAgent",
        domain="fitness",
        suggestions=suggestions,
        constraints_flagged=constraints,
        summary=f"Evaluated {len(ctx.workouts)} workout(s); free hours after sleep+study ≈ {free_hours:.1f} h.",
    )
