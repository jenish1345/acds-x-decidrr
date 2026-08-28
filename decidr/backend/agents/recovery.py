"""Recovery Agent – protects sleep and manages fatigue-related constraints."""

from __future__ import annotations
from models import (
    UserContext, AgentResponse, AgentSuggestion, Priority, ConstraintType
)


def evaluate(ctx: UserContext) -> AgentResponse:
    """Enforce sleep constraints and flag recovery needs."""
    suggestions: list[AgentSuggestion] = []
    constraints: list[str] = []
    sleep = ctx.sleep

    # ── Calculate total demand vs available hours ─────────────
    study_demand = sum(e.study_hours_needed for e in ctx.exams)
    workout_demand = sum(w.planned_duration_min / 60 for w in ctx.workouts)
    total_demand = study_demand + workout_demand + sleep.desired_hours

    overcommitted_by = max(0, total_demand - ctx.available_hours)

    # ── Sleep protection ──────────────────────────────────────
    if sleep.constraint_type == ConstraintType.HARD:
        # Sleep is a hard constraint — never reduce below minimum
        constraints.append(
            f"Sleep is a HARD constraint: minimum {sleep.min_acceptable_hours} h, target {sleep.desired_hours} h"
        )
        suggestions.append(
            AgentSuggestion(
                action="protect_sleep",
                detail=(
                    f"Sleep locked at {sleep.desired_hours} h "
                    f"(absolute minimum {sleep.min_acceptable_hours} h). "
                    f"Bedtime target: {sleep.bedtime_preference}."
                ),
                reasoning=(
                    "Sleep is marked as a hard constraint. Research shows that "
                    "student-athletes who sleep <7 h have 1.7× higher injury risk "
                    "and measurably lower cognitive performance. "
                    "This constraint will not be relaxed."
                ),
                confidence=0.98,
                priority=Priority.CRITICAL,
                time_impact_hours=sleep.desired_hours,
            )
        )
    else:
        # Sleep is soft — can trim slightly if overcommitted
        if overcommitted_by > 1:
            trim_hours = min(
                sleep.desired_hours - sleep.min_acceptable_hours,
                overcommitted_by * 0.3  # trim at most 30 % of the deficit from sleep
            )
            adjusted_sleep = round(sleep.desired_hours - trim_hours, 1)
            suggestions.append(
                AgentSuggestion(
                    action="trim_sleep",
                    detail=f"Reduce sleep to {adjusted_sleep} h (from {sleep.desired_hours} h).",
                    reasoning=(
                        f"Overcommitted by {overcommitted_by:.1f} h. "
                        f"Since sleep is a soft constraint, trimming {trim_hours:.1f} h. "
                        f"Still above minimum of {sleep.min_acceptable_hours} h."
                    ),
                    confidence=0.7,
                    priority=Priority.HIGH,
                    time_impact_hours=-trim_hours,
                )
            )
        else:
            suggestions.append(
                AgentSuggestion(
                    action="keep_sleep",
                    detail=f"Sleep maintained at {sleep.desired_hours} h.",
                    reasoning="No time pressure severe enough to justify reducing sleep.",
                    confidence=0.9,
                    priority=Priority.HIGH,
                    time_impact_hours=sleep.desired_hours,
                )
            )

    # ── Fatigue warning for high-intensity days ───────────────
    high_intensity_workouts = [w for w in ctx.workouts if w.intensity >= 8]
    urgent_exams = [e for e in ctx.exams if e.difficulty >= 7]

    if high_intensity_workouts and urgent_exams:
        suggestions.append(
            AgentSuggestion(
                action="fatigue_warning",
                detail=(
                    "High-intensity workout + difficult exam on the same day. "
                    "Consider spacing them or reducing workout intensity."
                ),
                reasoning=(
                    "Combining heavy physical exertion with cognitively demanding study "
                    "reduces performance in both. Separating by ≥4 h or reducing "
                    "workout intensity to ≤6/10 mitigates this."
                ),
                confidence=0.85,
                priority=Priority.HIGH,
                time_impact_hours=0,
            )
        )

    return AgentResponse(
        agent_name="RecoveryAgent",
        domain="recovery",
        suggestions=suggestions,
        constraints_flagged=constraints,
        summary=(
            f"Sleep: {sleep.desired_hours} h ({sleep.constraint_type.value} constraint). "
            f"Overcommitted by {overcommitted_by:.1f} h."
        ),
    )
