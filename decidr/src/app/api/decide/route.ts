import { NextRequest, NextResponse } from "next/server";

/* ────────────────────────────────────────────────────────────────
   Decidr Decision Engine — Next.js API Route
   
   This is a self-contained TypeScript port of the Python decision
   engine so the demo works without starting a separate backend.
   In production, this would proxy to the FastAPI agents.
   ──────────────────────────────────────────────────────────────── */

interface ExamInfo {
  subject: string;
  date: string;
  difficulty: number;
  study_hours_needed: number;
  priority: string;
}

interface WorkoutInfo {
  activity: string;
  planned_duration_min: number;
  intensity: number;
  is_competition_prep: boolean;
  priority: string;
}

interface SleepInfo {
  desired_hours: number;
  min_acceptable_hours: number;
  bedtime_preference: string;
  constraint_type: string;
}

interface UserContext {
  user_id: string;
  current_date: string;
  exams: ExamInfo[];
  workouts: WorkoutInfo[];
  sleep: SleepInfo;
  goals: unknown[];
  available_hours: number;
  notes: string | null;
}

interface Suggestion {
  action: string;
  detail: string;
  reasoning: string;
  confidence: number;
  priority: string;
  time_impact_hours: number;
}

interface AgentResponse {
  agent_name: string;
  domain: string;
  suggestions: Suggestion[];
  constraints_flagged: string[];
  summary: string;
}

/* ── Academic Agent ──────────────────────────────────────────── */
function runAcademic(ctx: UserContext): AgentResponse {
  const suggestions: Suggestion[] = [];
  const constraints: string[] = [];
  const now = new Date(ctx.current_date);

  for (const exam of ctx.exams) {
    const examDate = new Date(exam.date);
    const hoursUntil = Math.max((examDate.getTime() - now.getTime()) / 3600000, 0);
    const daysUntil = hoursUntil / 24;

    let urgency: string, multiplier: number, confidence: number;
    if (daysUntil <= 1) {
      urgency = "CRITICAL"; multiplier = 1.3; confidence = 0.95;
    } else if (daysUntil <= 3) {
      urgency = "HIGH"; multiplier = 1.1; confidence = 0.85;
    } else if (daysUntil <= 7) {
      urgency = "MEDIUM"; multiplier = 1.0; confidence = 0.75;
    } else {
      urgency = "LOW"; multiplier = 0.8; confidence = 0.65;
    }

    const recommendedHours = Math.round(exam.study_hours_needed * multiplier * 10) / 10;
    const blocks = Math.max(1, Math.floor(recommendedHours * 60 / 45));

    suggestions.push({
      action: "allocate_study_time",
      detail: `${exam.subject}: ${blocks} × 45-min study blocks (${recommendedHours} h total). Exam in ${Math.floor(daysUntil)} day(s), urgency=${urgency}.`,
      reasoning: `Difficulty ${exam.difficulty}/10 with ${exam.study_hours_needed} h still needed. At ${urgency} urgency we apply a ×${multiplier} buffer. 45-min blocks match strongest completion-rate pattern.`,
      confidence,
      priority: urgency === "CRITICAL" ? "critical" : "high",
      time_impact_hours: recommendedHours,
    });

    if (urgency === "CRITICAL") {
      constraints.push(`Study time for ${exam.subject} is a near-hard constraint (exam <24 h)`);
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      action: "no_exam_pressure",
      detail: "No upcoming exams detected. Free academic bandwidth.",
      reasoning: "Without imminent exams, academic time can be reallocated.",
      confidence: 0.9, priority: "low", time_impact_hours: 0,
    });
  }

  const totalStudy = suggestions.reduce((s, x) => s + x.time_impact_hours, 0);
  return {
    agent_name: "AcademicAgent", domain: "academic", suggestions, constraints_flagged: constraints,
    summary: `Recommended ${totalStudy.toFixed(1)} h of study across ${ctx.exams.length} exam(s).`,
  };
}

/* ── Fitness Agent ───────────────────────────────────────────── */
function runFitness(ctx: UserContext): AgentResponse {
  const suggestions: Suggestion[] = [];
  const constraints: string[] = [];

  const academicPressure = ctx.exams.reduce((s, e) => s + e.study_hours_needed, 0);
  const freeHours = ctx.available_hours - ctx.sleep.desired_hours - academicPressure;

  for (const wo of ctx.workouts) {
    const planned = wo.planned_duration_min;
    let minViable: number, priority: string;

    if (wo.is_competition_prep) {
      minViable = Math.max(Math.floor(planned * 0.7), 30); priority = "high";
    } else if (wo.intensity >= 7) {
      minViable = Math.max(Math.floor(planned * 0.5), 20); priority = "medium";
    } else {
      minViable = Math.max(Math.floor(planned * 0.3), 15); priority = "low";
    }

    let suggested: number, confidence: number, action: string, reasoning: string;

    if (freeHours < 2 && !wo.is_competition_prep) {
      suggested = minViable; confidence = 0.9; action = "reduce_workout";
      reasoning = `Only ${freeHours.toFixed(1)} h free after sleep + study. Reducing ${wo.activity} from ${planned} to ${suggested} min saves ${planned - suggested} min while maintaining training consistency.`;
    } else if (freeHours < 4) {
      suggested = Math.max(Math.floor(planned * 0.75), minViable); confidence = 0.8; action = "trim_workout";
      reasoning = `Moderate time pressure (${freeHours.toFixed(1)} h free). Trimming ${wo.activity} to ${suggested} min preserves the training stimulus.`;
    } else {
      suggested = planned; confidence = 0.85; action = "keep_workout";
      reasoning = `Sufficient free time (${freeHours.toFixed(1)} h). Keep ${wo.activity} at ${planned} min as planned.`;
    }

    suggestions.push({
      action, detail: `${wo.activity}: ${suggested} min (was ${planned} min). Intensity ${wo.intensity}/10.`,
      reasoning, confidence, priority, time_impact_hours: -Math.round((planned - suggested) / 60 * 100) / 100,
    });

    if (wo.is_competition_prep) {
      constraints.push(`${wo.activity} is competition-prep — cannot drop below ${minViable} min`);
    }
  }

  if (suggestions.length === 0) {
    suggestions.push({
      action: "no_workout_planned", detail: "No workouts scheduled today.",
      reasoning: "Consider active recovery if time allows.", confidence: 0.9, priority: "low", time_impact_hours: 0,
    });
  }

  return {
    agent_name: "FitnessAgent", domain: "fitness", suggestions, constraints_flagged: constraints,
    summary: `Evaluated ${ctx.workouts.length} workout(s); free hours after sleep+study ≈ ${freeHours.toFixed(1)} h.`,
  };
}

/* ── Recovery Agent ──────────────────────────────────────────── */
function runRecovery(ctx: UserContext): AgentResponse {
  const suggestions: Suggestion[] = [];
  const constraints: string[] = [];
  const sleep = ctx.sleep;

  const studyDemand = ctx.exams.reduce((s, e) => s + e.study_hours_needed, 0);
  const workoutDemand = ctx.workouts.reduce((s, w) => s + w.planned_duration_min / 60, 0);
  const totalDemand = studyDemand + workoutDemand + sleep.desired_hours;
  const overcommitted = Math.max(0, totalDemand - ctx.available_hours);

  if (sleep.constraint_type === "hard") {
    constraints.push(`Sleep is a HARD constraint: minimum ${sleep.min_acceptable_hours} h, target ${sleep.desired_hours} h`);
    suggestions.push({
      action: "protect_sleep",
      detail: `Sleep locked at ${sleep.desired_hours} h (absolute minimum ${sleep.min_acceptable_hours} h). Bedtime target: ${sleep.bedtime_preference}.`,
      reasoning: "Sleep is marked as a hard constraint. Research shows student-athletes who sleep <7 h have 1.7× higher injury risk and measurably lower cognitive performance. This constraint will not be relaxed.",
      confidence: 0.98, priority: "critical", time_impact_hours: sleep.desired_hours,
    });
  } else {
    if (overcommitted > 1) {
      const trim = Math.min(sleep.desired_hours - sleep.min_acceptable_hours, overcommitted * 0.3);
      const adjusted = Math.round((sleep.desired_hours - trim) * 10) / 10;
      suggestions.push({
        action: "trim_sleep",
        detail: `Reduce sleep to ${adjusted} h (from ${sleep.desired_hours} h).`,
        reasoning: `Overcommitted by ${overcommitted.toFixed(1)} h. Since sleep is a soft constraint, trimming ${trim.toFixed(1)} h. Still above minimum of ${sleep.min_acceptable_hours} h.`,
        confidence: 0.7, priority: "high", time_impact_hours: -trim,
      });
    } else {
      suggestions.push({
        action: "keep_sleep",
        detail: `Sleep maintained at ${sleep.desired_hours} h.`,
        reasoning: "No time pressure severe enough to justify reducing sleep.",
        confidence: 0.9, priority: "high", time_impact_hours: sleep.desired_hours,
      });
    }
  }

  const highIntensity = ctx.workouts.some(w => w.intensity >= 8);
  const hardExam = ctx.exams.some(e => e.difficulty >= 7);
  if (highIntensity && hardExam) {
    suggestions.push({
      action: "fatigue_warning",
      detail: "High-intensity workout + difficult exam on the same day. Consider spacing them or reducing workout intensity.",
      reasoning: "Combining heavy physical exertion with cognitively demanding study reduces performance in both. Separating by ≥4 h or reducing workout intensity to ≤6/10 mitigates this.",
      confidence: 0.85, priority: "high", time_impact_hours: 0,
    });
  }

  return {
    agent_name: "RecoveryAgent", domain: "recovery", suggestions, constraints_flagged: constraints,
    summary: `Sleep: ${sleep.desired_hours} h (${sleep.constraint_type} constraint). Overcommitted by ${overcommitted.toFixed(1)} h.`,
  };
}

/* ── Schedule Agent ──────────────────────────────────────────── */
function runSchedule(ctx: UserContext): AgentResponse {
  const suggestions: Suggestion[] = [];
  const constraints: string[] = [];

  const sleepH = ctx.sleep.desired_hours;
  const studyH = ctx.exams.reduce((s, e) => s + e.study_hours_needed, 0);
  const workoutH = ctx.workouts.reduce((s, w) => s + w.planned_duration_min / 60, 0);
  const totalDemand = sleepH + studyH + workoutH;
  const slack = ctx.available_hours - totalDemand;

  if (slack < 0) {
    constraints.push(`Schedule OVERLOADED by ${Math.abs(slack).toFixed(1)} h — adjustments required`);
    suggestions.push({
      action: "schedule_conflict", priority: "critical", confidence: 0.95, time_impact_hours: slack,
      detail: `Total demand (${totalDemand.toFixed(1)} h) exceeds available time (${ctx.available_hours.toFixed(1)} h) by ${Math.abs(slack).toFixed(1)} h. Something must be reduced or dropped.`,
      reasoning: "The schedule is physically impossible as planned. The decision engine prioritises hard constraints (sleep), then high-priority activities (exams), then adjusts remaining items.",
    });
  } else if (slack < 2) {
    suggestions.push({
      action: "schedule_tight", priority: "medium", confidence: 0.8, time_impact_hours: 0,
      detail: `Only ${slack.toFixed(1)} h of slack. Schedule is tight but feasible.`,
      reasoning: "Minimal buffer for transitions, meals, and unexpected events. Recommend keeping transitions to ≤15 min between activities.",
    });
  } else {
    suggestions.push({
      action: "schedule_comfortable", priority: "low", confidence: 0.9, time_impact_hours: 0,
      detail: `${slack.toFixed(1)} h of free time available after all commitments.`,
      reasoning: "Comfortable schedule. Use free time for active recovery or personal goals.",
    });
  }

  const hasModerateWorkout = ctx.workouts.some(w => w.intensity <= 6);
  if (studyH >= 3 && hasModerateWorkout) {
    suggestions.push({
      action: "sequence_recommendation", priority: "medium", confidence: 0.8, time_impact_hours: 0,
      detail: "Workout first (morning), then study blocks, then wind-down before bed.",
      reasoning: "Research shows moderate exercise before study improves focus and retention. Placing the workout first front-loads physical energy and leaves the afternoon for cognitive work.",
    });
  } else if (studyH >= 3) {
    suggestions.push({
      action: "sequence_recommendation", priority: "medium", confidence: 0.75, time_impact_hours: 0,
      detail: "Start with the hardest study block, take 15-min breaks between blocks.",
      reasoning: "Cognitive performance peaks in the first 2–3 hours after waking. Tackle the most difficult subject first.",
    });
  }

  return {
    agent_name: "ScheduleAgent", domain: "schedule", suggestions, constraints_flagged: constraints,
    summary: `Demand: ${totalDemand.toFixed(1)} h | Available: ${ctx.available_hours.toFixed(1)} h | Slack: ${slack.toFixed(1)} h.`,
  };
}

/* ── Plan block builder ──────────────────────────────────────── */
interface PlanBlock {
  time_slot: string | null;
  activity: string;
  duration_min: number;
  rationale: string;
  adjusted_from: string | null;
}

function buildBlocks(
  ctx: UserContext,
  academic: AgentResponse,
  fitness: AgentResponse,
  recovery: AgentResponse,
): PlanBlock[] {
  const blocks: PlanBlock[] = [];

  // Sleep
  let sleepHours = ctx.sleep.desired_hours;
  for (const s of recovery.suggestions) {
    if (s.action === "trim_sleep") sleepHours += s.time_impact_hours; // negative
  }
  blocks.push({
    time_slot: `${ctx.sleep.bedtime_preference}–wake`,
    activity: "Sleep",
    duration_min: Math.round(sleepHours * 60),
    rationale: `Protected sleep: ${sleepHours.toFixed(1)} h. ${ctx.sleep.constraint_type} constraint.`,
    adjusted_from: null,
  });

  // Workouts
  for (const s of fitness.suggestions) {
    if (["reduce_workout", "trim_workout", "keep_workout"].includes(s.action)) {
      const mMatch = s.detail.match(/(\d+)\s*min/);
      const dur = mMatch ? parseInt(mMatch[1]) : 30;
      const wasMatch = s.detail.match(/was\s+(\d+)/);
      blocks.push({
        time_slot: "Morning (flexible)",
        activity: s.detail.split(":")[0].trim(),
        duration_min: dur,
        rationale: s.reasoning,
        adjusted_from: ["reduce_workout", "trim_workout"].includes(s.action) && wasMatch
          ? `Originally ${wasMatch[1]} min` : null,
      });
    }
  }

  // Study
  for (const s of academic.suggestions) {
    if (s.action === "allocate_study_time") {
      blocks.push({
        time_slot: "Afternoon/Evening (flexible)",
        activity: `Study: ${s.detail.split(":")[0].trim()}`,
        duration_min: Math.round(s.time_impact_hours * 60),
        rationale: s.reasoning,
        adjusted_from: null,
      });
    }
  }

  // Free time
  const usedMin = blocks.reduce((s, b) => s + b.duration_min, 0);
  const freeMin = Math.max(0, ctx.available_hours * 60 - usedMin);
  if (freeMin > 15) {
    blocks.push({
      time_slot: "Flexible",
      activity: "Free / Active Recovery",
      duration_min: Math.round(freeMin),
      rationale: "Remaining time for meals, transitions, rest, or personal goals.",
      adjusted_from: null,
    });
  }

  return blocks;
}

/* ── POST /api/decide ────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  try {
    const ctx: UserContext = await request.json();

    const academic = runAcademic(ctx);
    const fitness = runFitness(ctx);
    const recovery = runRecovery(ctx);
    const schedule = runSchedule(ctx);
    const agents = [academic, fitness, recovery, schedule];

    const hardConstraints = agents.flatMap(a => a.constraints_flagged);
    const tradeOffs = agents.flatMap(a =>
      a.suggestions.filter(s => ["reduce_workout", "trim_workout", "trim_sleep"].includes(s.action)).map(s => s.detail),
    );
    const planBlocks = buildBlocks(ctx, academic, fitness, recovery);

    const summaries = agents.map(a => a.summary);
    const overall =
      "Based on analysis from 4 specialist agents:\n" +
      summaries.map(s => `• ${s}`).join("\n") +
      "\n\nThe plan protects hard constraints and adjusts lower-priority activities to fit within available time.";

    const allConf = agents.flatMap(a => a.suggestions.map(s => s.confidence));
    const avgConf = allConf.length > 0 ? allConf.reduce((s, c) => s + c, 0) / allConf.length : 0.5;

    return NextResponse.json({
      user_id: ctx.user_id,
      generated_at: new Date().toISOString(),
      plan_blocks: planBlocks,
      hard_constraints_honoured: hardConstraints,
      trade_offs_made: tradeOffs,
      overall_reasoning: overall,
      confidence: Math.round(avgConf * 100) / 100,
      agent_contributions: agents,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
