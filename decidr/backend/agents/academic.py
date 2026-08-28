"""Academic Agent – evaluates exam urgency and study time requirements."""

from __future__ import annotations
from datetime import datetime
from models import (
    UserContext, AgentResponse, AgentSuggestion, Priority
)


def evaluate(ctx: UserContext) -> AgentResponse:
    """Analyse exam urgency and return study-time suggestions."""
    suggestions: list[AgentSuggestion] = []
    constraints: list[str] = []
    now = ctx.current_date

    for exam in sorted(ctx.exams, key=lambda e: e.date):
        hours_until = max((exam.date - now).total_seconds() / 3600, 0)
        days_until = hours_until / 24

        # ── urgency tiers ──────────────────────────────────────
        if days_until <= 1:
            urgency = "CRITICAL"
            study_multiplier = 1.3  # cram mode – add 30 % buffer
            confidence = 0.95
        elif days_until <= 3:
            urgency = "HIGH"
            study_multiplier = 1.1
            confidence = 0.85
        elif days_until <= 7:
            urgency = "MEDIUM"
            study_multiplier = 1.0
            confidence = 0.75
        else:
            urgency = "LOW"
            study_multiplier = 0.8  # can afford to spread out
            confidence = 0.65

        recommended_hours = round(exam.study_hours_needed * study_multiplier, 1)

        # ── suggest focused blocks (45-min Pomodoro style) ─────
        blocks_needed = max(1, int(recommended_hours * 60 / 45))
        block_label = f"{blocks_needed} × 45-min study blocks"

        suggestion = AgentSuggestion(
            action="allocate_study_time",
            detail=(
                f"{exam.subject}: {block_label} ({recommended_hours} h total). "
                f"Exam in {days_until:.0f} day(s), urgency={urgency}."
            ),
            reasoning=(
                f"Difficulty {exam.difficulty}/10 with {exam.study_hours_needed} h still needed. "
                f"At {urgency} urgency we apply a ×{study_multiplier} buffer. "
                f"45-min blocks match your strongest completion-rate pattern."
            ),
            confidence=confidence,
            priority=Priority.CRITICAL if urgency == "CRITICAL" else Priority.HIGH,
            time_impact_hours=recommended_hours,
        )
        suggestions.append(suggestion)

        if urgency == "CRITICAL":
            constraints.append(f"Study time for {exam.subject} is a near-hard constraint (exam <24 h)")

    # ── fallback when no exams ─────────────────────────────────
    if not suggestions:
        suggestions.append(
            AgentSuggestion(
                action="no_exam_pressure",
                detail="No upcoming exams detected. Free academic bandwidth.",
                reasoning="Without imminent exams, academic time can be reallocated.",
                confidence=0.9,
                priority=Priority.LOW,
                time_impact_hours=0,
            )
        )

    total_study = sum(s.time_impact_hours for s in suggestions)
    return AgentResponse(
        agent_name="AcademicAgent",
        domain="academic",
        suggestions=suggestions,
        constraints_flagged=constraints,
        summary=f"Recommended {total_study:.1f} h of study across {len(ctx.exams)} exam(s).",
    )
