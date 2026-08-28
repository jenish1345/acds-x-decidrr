import Link from "next/link";

export default function Home() {
  return (
    <main className="gradient-bg min-h-screen flex flex-col">
      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[var(--primary-light)]">Decidr</span>
          </span>
          <span className="badge badge-low text-[10px]">beta</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/corporate" className="text-sm hover:text-[var(--primary-light)] transition">
            Corporate Tasks
          </Link>
          <Link href="/decide" className="btn-primary text-sm">
            Get Started →
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
        <div className="fade-in-up max-w-3xl mx-auto">
          <p className="text-[var(--primary-light)] font-semibold text-sm tracking-widest uppercase mb-4">
            Track 04 — Personal Assistant
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            When everything matters,
            <br />
            <span className="bg-gradient-to-r from-[var(--primary-light)] via-[var(--accent-blue)] to-[var(--accent-green)] bg-clip-text text-transparent">
              what should you adjust?
            </span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            Decidr helps student-athletes make the right trade-offs between
            study, training, and recovery — based on their own goals,
            constraints, and history.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/decide" className="btn-primary text-base px-8 py-3.5">
              ⚡ Build My Plan
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base px-8 py-3.5">
              How It Works
            </a>
          </div>
        </div>

        {/* ── Feature cards ──────────────────────────────── */}
        <div
          id="how-it-works"
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl w-full"
        >
          {[
            {
              icon: "📚",
              title: "Academic Agent",
              desc: "Evaluates exam urgency, study-time needs, and optimal block scheduling.",
              color: "var(--accent-blue)",
            },
            {
              icon: "🏋️",
              title: "Fitness Agent",
              desc: "Determines minimum-viable workouts so training consistency stays intact.",
              color: "var(--accent-green)",
            },
            {
              icon: "😴",
              title: "Recovery Agent",
              desc: "Protects sleep as a hard constraint and flags fatigue risks.",
              color: "var(--accent-amber)",
            },
            {
              icon: "📅",
              title: "Schedule Agent",
              desc: "Checks available time, detects conflicts, and suggests optimal sequencing.",
              color: "var(--primary-light)",
            },
          ].map((card, i) => (
            <div
              key={card.title}
              className={`glass-card p-6 fade-in-up delay-${(i + 1) * 100}`}
            >
              <div
                className="text-3xl mb-3 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}15` }}
              >
                {card.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="relative z-10 text-center py-8 text-[var(--text-muted)] text-sm border-t border-[var(--border)]">
        Built for the{" "}
        <span className="text-[var(--primary-light)] font-semibold">
          Tenori Stateless Hackathon 2026
        </span>{" "}
        · Track 04 — Personal Assistant
      </footer>
    </main>
  );
}
