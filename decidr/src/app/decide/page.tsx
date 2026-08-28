"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Types matching backend models ──────────────────────────── */
interface ExamInput {
  subject: string;
  date: string;
  difficulty: number;
  study_hours_needed: number;
}

interface WorkoutInput {
  activity: string;
  planned_duration_min: number;
  intensity: number;
  is_competition_prep: boolean;
}

interface SleepInput {
  desired_hours: number;
  min_acceptable_hours: number;
  bedtime_preference: string;
  constraint_type: "hard" | "soft";
}

interface PlanBlock {
  time_slot: string | null;
  activity: string;
  duration_min: number;
  rationale: string;
  adjusted_from: string | null;
}

interface AgentContribution {
  agent_name: string;
  domain: string;
  summary: string;
  suggestions: { action: string; detail: string; reasoning: string; confidence: number; priority: string }[];
  constraints_flagged: string[];
}

interface DecisionPlan {
  user_id: string;
  generated_at: string;
  plan_blocks: PlanBlock[];
  hard_constraints_honoured: string[];
  trade_offs_made: string[];
  overall_reasoning: string;
  confidence: number;
  agent_contributions: AgentContribution[];
}

/* ── Helper components ──────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold mb-4 flex items-center gap-2">{children}</h2>;
}

function priorityBadge(p: string) {
  const map: Record<string, string> = {
    critical: "badge-critical",
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
  };
  return <span className={`badge ${map[p] || "badge-medium"}`}>{p}</span>;
}

/* ── Main page ──────────────────────────────────────────────── */
export default function DecidePage() {
  /* Form state */
  const [exams, setExams] = useState<ExamInput[]>([
    { subject: "", date: "", difficulty: 5, study_hours_needed: 2 },
  ]);
  const [workouts, setWorkouts] = useState<WorkoutInput[]>([
    { activity: "General Training", planned_duration_min: 60, intensity: 6, is_competition_prep: false },
  ]);
  const [sleep, setSleep] = useState<SleepInput>({
    desired_hours: 8,
    min_acceptable_hours: 7,
    bedtime_preference: "22:00",
    constraint_type: "hard",
  });
  const [availableHours, setAvailableHours] = useState(16);
  const [notes, setNotes] = useState("");

  /* Result state */
  const [plan, setPlan] = useState<DecisionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  /* ── Exam helpers ──────────────────────────────────────────── */
  const addExam = () =>
    setExams([...exams, { subject: "", date: "", difficulty: 5, study_hours_needed: 2 }]);
  const removeExam = (i: number) => setExams(exams.filter((_, idx) => idx !== i));
  const updateExam = (i: number, field: keyof ExamInput, value: string | number) =>
    setExams(exams.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));

  /* ── Workout helpers ───────────────────────────────────────── */
  const addWorkout = () =>
    setWorkouts([
      ...workouts,
      { activity: "Training", planned_duration_min: 45, intensity: 5, is_competition_prep: false },
    ]);
  const removeWorkout = (i: number) => setWorkouts(workouts.filter((_, idx) => idx !== i));
  const updateWorkout = (i: number, field: keyof WorkoutInput, value: string | number | boolean) =>
    setWorkouts(workouts.map((w, idx) => (idx === i ? { ...w, [field]: value } : w)));

  /* ── Submit ────────────────────────────────────────────────── */
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setFeedbackSent(false);

    try {
      const payload = {
        user_id: "demo-user",
        current_date: new Date().toISOString(),
        exams: exams
          .filter((e) => e.subject && e.date)
          .map((e) => ({
            ...e,
            date: new Date(e.date).toISOString(),
            priority: "high",
          })),
        workouts: workouts.map((w) => ({ ...w, priority: "medium" })),
        sleep: { ...sleep },
        goals: [],
        available_hours: availableHours,
        notes: notes || null,
      };

      const res = await fetch("/api/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Server error ${res.status}: ${errBody}`);
      }

      const data: DecisionPlan = await res.json();
      setPlan(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <main className="gradient-bg min-h-screen">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-2xl font-bold tracking-tight text-[var(--primary-light)]">
          Decidr
        </Link>
        <span className="text-sm text-[var(--text-muted)]">Decision Builder</span>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        {!plan ? (
          /* ═══════════════ FORM ═══════════════ */
          <div className="fade-in-up">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
                Build Your{" "}
                <span className="bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent-green)] bg-clip-text text-transparent">
                  Decision Plan
                </span>
              </h1>
              <p className="text-[var(--text-muted)]">
                Tell us about today&apos;s commitments. We&apos;ll analyse and create an optimal plan.
              </p>
            </div>

            {/* ── Exams ──────────────────────── */}
            <section className="glass-card p-6 mb-6">
              <SectionTitle>📚 Exams &amp; Study</SectionTitle>
              {exams.map((exam, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 items-end">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Subject</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Physics"
                      value={exam.subject}
                      onChange={(e) => updateExam(i, "subject", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Exam Date</label>
                    <input
                      className="input-field"
                      type="datetime-local"
                      value={exam.date}
                      onChange={(e) => updateExam(i, "date", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                      Difficulty ({exam.difficulty}/10)
                    </label>
                    <input
                      className="input-field"
                      type="range"
                      min={1}
                      max={10}
                      value={exam.difficulty}
                      onChange={(e) => updateExam(i, "difficulty", +e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-xs text-[var(--text-muted)] mb-1">
                        Study hrs needed
                      </label>
                      <input
                        className="input-field"
                        type="number"
                        min={0}
                        step={0.5}
                        value={exam.study_hours_needed}
                        onChange={(e) => updateExam(i, "study_hours_needed", +e.target.value)}
                      />
                    </div>
                    {exams.length > 1 && (
                      <button
                        onClick={() => removeExam(i)}
                        className="text-[var(--accent-red)] hover:bg-[rgba(239,68,68,0.1)] rounded-lg p-2 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={addExam} className="text-sm text-[var(--primary-light)] hover:underline mt-1">
                + Add another exam
              </button>
            </section>

            {/* ── Workouts ───────────────────── */}
            <section className="glass-card p-6 mb-6">
              <SectionTitle>🏋️ Workouts</SectionTitle>
              {workouts.map((wo, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 items-end">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Activity</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Football Drill"
                      value={wo.activity}
                      onChange={(e) => updateWorkout(i, "activity", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                      Duration (min)
                    </label>
                    <input
                      className="input-field"
                      type="number"
                      min={0}
                      value={wo.planned_duration_min}
                      onChange={(e) => updateWorkout(i, "planned_duration_min", +e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                      Intensity ({wo.intensity}/10)
                    </label>
                    <input
                      className="input-field"
                      type="range"
                      min={1}
                      max={10}
                      value={wo.intensity}
                      onChange={(e) => updateWorkout(i, "intensity", +e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wo.is_competition_prep}
                        onChange={(e) => updateWorkout(i, "is_competition_prep", e.target.checked)}
                        className="accent-[var(--primary)]"
                      />
                      Comp prep
                    </label>
                    {workouts.length > 1 && (
                      <button
                        onClick={() => removeWorkout(i)}
                        className="text-[var(--accent-red)] hover:bg-[rgba(239,68,68,0.1)] rounded-lg p-2 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={addWorkout} className="text-sm text-[var(--primary-light)] hover:underline mt-1">
                + Add another workout
              </button>
            </section>

            {/* ── Sleep ──────────────────────── */}
            <section className="glass-card p-6 mb-6">
              <SectionTitle>😴 Sleep &amp; Recovery</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">
                    Desired sleep (h)
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    min={4}
                    max={12}
                    step={0.5}
                    value={sleep.desired_hours}
                    onChange={(e) => setSleep({ ...sleep, desired_hours: +e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">
                    Min acceptable (h)
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    min={4}
                    max={12}
                    step={0.5}
                    value={sleep.min_acceptable_hours}
                    onChange={(e) => setSleep({ ...sleep, min_acceptable_hours: +e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Bedtime</label>
                  <input
                    className="input-field"
                    type="time"
                    value={sleep.bedtime_preference}
                    onChange={(e) => setSleep({ ...sleep, bedtime_preference: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Constraint</label>
                  <select
                    className="input-field"
                    value={sleep.constraint_type}
                    onChange={(e) =>
                      setSleep({ ...sleep, constraint_type: e.target.value as "hard" | "soft" })
                    }
                  >
                    <option value="hard">🔒 Hard (never reduce)</option>
                    <option value="soft">🔓 Soft (can adjust)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* ── General ────────────────────── */}
            <section className="glass-card p-6 mb-8">
              <SectionTitle>⏱️ Available Time</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">
                    Waking hours today
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    min={1}
                    max={24}
                    value={availableHours}
                    onChange={(e) => setAvailableHours(+e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">
                    Notes (optional)
                  </label>
                  <input
                    className="input-field"
                    placeholder="e.g. Team meeting at 3 PM"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* ── Submit ─────────────────────── */}
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[var(--accent-red)] text-[var(--accent-red)] text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  Agents are thinking…
                </>
              ) : (
                "⚡ Generate My Plan"
              )}
            </button>
          </div>
        ) : (
          /* ═══════════════ PLAN DISPLAY ═══════════════ */
          <div className="fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold mb-1">Your Decision Plan</h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Generated at {new Date(plan.generated_at).toLocaleTimeString()} · Confidence:{" "}
                  <span className="text-[var(--accent-green)] font-bold">
                    {(plan.confidence * 100).toFixed(0)}%
                  </span>
                </p>
              </div>
              <button onClick={() => setPlan(null)} className="btn-secondary text-sm">
                ← Back to Form
              </button>
            </div>

            {/* ── Hard constraints ───────────── */}
            {plan.hard_constraints_honoured.length > 0 && (
              <div className="glass-card p-5 mb-5 border-l-4 border-l-[var(--accent-green)]">
                <h3 className="font-bold text-sm text-[var(--accent-green)] mb-2">
                  🛡️ Hard Constraints Protected
                </h3>
                <ul className="text-sm space-y-1">
                  {plan.hard_constraints_honoured.map((c, i) => (
                    <li key={i} className="text-[var(--text-muted)]">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Trade-offs ─────────────────── */}
            {plan.trade_offs_made.length > 0 && (
              <div className="glass-card p-5 mb-5 border-l-4 border-l-[var(--accent-amber)]">
                <h3 className="font-bold text-sm text-[var(--accent-amber)] mb-2">
                  ⚖️ Trade-offs Made
                </h3>
                <ul className="text-sm space-y-1">
                  {plan.trade_offs_made.map((t, i) => (
                    <li key={i} className="text-[var(--text-muted)]">
                      • {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Plan blocks ────────────────── */}
            <div className="space-y-4 mb-8">
              {plan.plan_blocks.map((block, i) => (
                <div key={i} className="glass-card p-5 flex gap-5 items-start">
                  <div className="flex-shrink-0 w-28 text-center">
                    <div className="text-xs text-[var(--text-muted)] mb-1">
                      {block.time_slot || "Flexible"}
                    </div>
                    <div className="text-2xl font-bold text-[var(--primary-light)]">
                      {block.duration_min}
                      <span className="text-xs font-normal text-[var(--text-muted)]"> min</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1">{block.activity}</h3>
                    {block.adjusted_from && (
                      <p className="text-xs text-[var(--accent-amber)] mb-1">⚠️ {block.adjusted_from}</p>
                    )}
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{block.rationale}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Agent contributions ─────────── */}
            <details className="glass-card p-5 mb-8">
              <summary className="font-bold cursor-pointer">
                🤖 Agent Contributions ({plan.agent_contributions.length} agents)
              </summary>
              <div className="mt-4 space-y-4">
                {plan.agent_contributions.map((agent, i) => (
                  <div key={i} className="border-l-2 border-[var(--border)] pl-4">
                    <h4 className="font-bold text-sm mb-1">
                      {agent.agent_name}{" "}
                      <span className="text-[var(--text-muted)] font-normal">({agent.domain})</span>
                    </h4>
                    <p className="text-sm text-[var(--text-muted)] mb-2">{agent.summary}</p>
                    {agent.suggestions.map((s, j) => (
                      <div key={j} className="text-xs text-[var(--text-muted)] mb-1 flex gap-2 items-start">
                        {priorityBadge(s.priority)}
                        <span>{s.detail}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </details>

            {/* ── Overall reasoning ──────────── */}
            <div className="glass-card p-5 mb-8">
              <h3 className="font-bold mb-2">📝 Overall Reasoning</h3>
              <pre className="text-sm text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">
                {plan.overall_reasoning}
              </pre>
            </div>

            {/* ── Feedback ───────────────────── */}
            <div className="text-center">
              {!feedbackSent ? (
                <div className="flex items-center justify-center gap-4">
                  <p className="text-[var(--text-muted)] text-sm">Did you follow this plan?</p>
                  <button
                    onClick={() => setFeedbackSent(true)}
                    className="btn-primary text-sm px-6 py-2"
                  >
                    ✅ Yes, I followed it
                  </button>
                  <button
                    onClick={() => setFeedbackSent(true)}
                    className="btn-secondary text-sm px-6 py-2"
                  >
                    ❌ No
                  </button>
                </div>
              ) : (
                <p className="text-[var(--accent-green)] font-semibold">
                  Thanks for the feedback! This helps Decidr improve over time.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
