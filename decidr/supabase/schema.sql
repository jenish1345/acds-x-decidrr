-- ════════════════════════════════════════════════════════════
-- Decidr — Supabase Database Schema
-- ════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── User Context ─────────────────────────────────────────────
-- Stores the user's preferences, goals, and current context.
CREATE TABLE IF NOT EXISTS user_context (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}'::jsonb,
    goals JSONB DEFAULT '[]'::jsonb,
    sleep_settings JSONB DEFAULT '{"desired_hours": 8, "min_acceptable_hours": 7, "bedtime_preference": "22:00", "constraint_type": "hard"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_context_user ON user_context(user_id);

-- ── Plans ────────────────────────────────────────────────────
-- Stores each generated decision plan for review and analysis.
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    input_payload JSONB NOT NULL,
    plan_output JSONB NOT NULL,
    confidence DECIMAL(3, 2),
    hard_constraints_honoured TEXT[],
    trade_offs_made TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plans_user ON plans(user_id);
CREATE INDEX idx_plans_created ON plans(created_at DESC);

-- ── Feedback ─────────────────────────────────────────────────
-- User feedback on whether they followed a plan.
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    followed BOOLEAN NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_plan ON feedback(plan_id);
CREATE INDEX idx_feedback_user ON feedback(user_id);

-- ── Activity Log ─────────────────────────────────────────────
-- Records of completed activities for pattern learning.
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('study', 'workout', 'sleep', 'other')),
    description TEXT,
    duration_min INT NOT NULL CHECK (duration_min >= 0),
    intensity INT CHECK (intensity BETWEEN 1 AND 10),
    completed BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_type ON activity_log(activity_type);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE user_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY user_context_policy ON user_context
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY plans_policy ON plans
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY feedback_policy ON feedback
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY activity_log_policy ON activity_log
    FOR ALL USING (auth.uid() = user_id);
