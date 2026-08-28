"""Decision Engine – orchestrates all agents and produces a unified plan."""

from __future__ import annotations
from datetime import datetime
from models import (
    UserContext, AgentResponse, DecisionPlan, PlanBlock
)
from agents import academic, fitness, recovery, schedule


def _build_time_blocks(
    ctx: UserContext,
    academic_resp: AgentResponse,
    fitness_resp: AgentResponse,
    recovery_resp: AgentResponse,
    schedule_resp: AgentResponse,
) -> list[PlanBlock]:
    """Turn agent suggestions into a sequenced list of plan blocks."""
    blocks: list[PlanBlock] = []

    # ── 1. Sleep block (always first priority) ────────────────
    sleep = ctx.sleep
    sleep_hours = sleep.desired_hours

    # Check if recovery agent trimmed sleep
    for s in recovery_resp.suggestions:
        if s.action == "trim_sleep":
            sleep_hours = sleep.desired_hours + s.time_impact_hours  # time_impact is negative

    bedtime = sleep.bedtime_preference or "22:00"
    blocks.append(PlanBlock(
        time_slot=f"{bedtime}–wake",
        activity="Sleep",
        duration_min=int(sleep_hours * 60),
        rationale=f"Protected sleep: {sleep_hours:.1f} h. {sleep.constraint_type.value} constraint.",
    ))

    # ── 2. Workout blocks ─────────────────────────────────────
    for s in fitness_resp.suggestions:
        if s.action in ("reduce_workout", "trim_workout", "keep_workout"):
            # Parse suggested duration from detail string
            parts = s.detail.split(":")
            wo_name = parts[0].strip() if parts else "Workout"
            # Extract minutes from detail like "30 min (was 70 min)"
            import re
            mins_match = re.search(r"(\d+)\s*min", s.detail)
            duration = int(mins_match.group(1)) if mins_match else 30

            adjusted_from = None
            if s.action in ("reduce_workout", "trim_workout"):
                was_match = re.search(r"was\s+(\d+)", s.detail)
                if was_match:
                    adjusted_from = f"Originally {was_match.group(1)} min"

            blocks.append(PlanBlock(
                time_slot="Morning (flexible)",
                activity=wo_name,
                duration_min=duration,
                rationale=s.reasoning,
                adjusted_from=adjusted_from,
            ))

    # ── 3. Study blocks ───────────────────────────────────────
    for s in academic_resp.suggestions:
        if s.action == "allocate_study_time":
            subject = s.detail.split(":")[0].strip()
            total_min = int(s.time_impact_hours * 60)
            blocks.append(PlanBlock(
                time_slot="Afternoon/Evening (flexible)",
                activity=f"Study: {subject}",
                duration_min=total_min,
                rationale=s.reasoning,
            ))

    # ── 4. Buffer / free time ─────────────────────────────────
    used_min = sum(b.duration_min for b in blocks)
    available_min = int(ctx.available_hours * 60)
    free_min = max(0, available_min - used_min)

    if free_min > 15:
        blocks.append(PlanBlock(
            time_slot="Flexible",
            activity="Free / Active Recovery",
            duration_min=free_min,
            rationale="Remaining time for meals, transitions, rest, or personal goals.",
        ))

    return blocks


def decide(ctx: UserContext) -> DecisionPlan:
    """Run all agents and produce the final decision plan."""
    # ── Call each agent ────────────────────────────────────────
    academic_resp = academic.evaluate(ctx)
    fitness_resp = fitness.evaluate(ctx)
    recovery_resp = recovery.evaluate(ctx)
    schedule_resp = schedule.evaluate(ctx)

    agent_responses = [academic_resp, fitness_resp, recovery_resp, schedule_resp]

    # ── Collect hard constraints honoured ──────────────────────
    hard_constraints = []
    for resp in agent_responses:
        hard_constraints.extend(resp.constraints_flagged)

    # ── Collect trade-offs ────────────────────────────────────
    trade_offs = []
    for resp in agent_responses:
        for s in resp.suggestions:
            if s.action in ("reduce_workout", "trim_workout", "trim_sleep"):
                trade_offs.append(s.detail)

    # ── Build plan blocks ─────────────────────────────────────
    plan_blocks = _build_time_blocks(
        ctx, academic_resp, fitness_resp, recovery_resp, schedule_resp
    )

    # ── Overall reasoning ─────────────────────────────────────
    summaries = [r.summary for r in agent_responses]
    overall = (
        "Based on analysis from 4 specialist agents:\n"
        + "\n".join(f"• {s}" for s in summaries)
        + "\n\nThe plan protects hard constraints and adjusts lower-priority "
        "activities to fit within available time."
    )

    # ── Average confidence ────────────────────────────────────
    all_confs = [
        s.confidence
        for resp in agent_responses
        for s in resp.suggestions
    ]
    avg_confidence = sum(all_confs) / len(all_confs) if all_confs else 0.5

    return DecisionPlan(
        user_id=ctx.user_id,
        generated_at=datetime.now(),
        plan_blocks=plan_blocks,
        hard_constraints_honoured=hard_constraints,
        trade_offs_made=trade_offs,
        overall_reasoning=overall,
        confidence=round(avg_confidence, 2),
        agent_contributions=agent_responses,
    )
