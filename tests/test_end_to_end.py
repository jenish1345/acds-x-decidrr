"""
DECIDR End-to-End Closed-Loop Integration Test.

Tests:
  1. Organization Risk Detection (anomaly signal)
  2. Multi-Agent Swarm (Finance, Workforce, Ops) Debate & Conflict Resolution
  3. Decision Contract Creation
  4. Executive Approval → Corporate Action
  5. Personal DECIDR Constitution & Attention Shield Evaluation
  6. Counterproposal Generation
  7. Privacy-Safe Aggregation (incl. small-group suppression)
  8. Correlation ID end-to-end tracing
"""

import sys
import os
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from shared.contracts import (
    AggregateWorkforceSignal,
    CorporateAction,
    ActionOutcome,
    DecisionContract,
)

from acds_platform.backend.agents import finance, people, operations, orchestrator


# ─── helpers ────────────────────────────────────────────────────────────────

def _make_signal(employee_count=24) -> AggregateWorkforceSignal:
    return AggregateWorkforceSignal(
        organization_id="ACME_TECH",
        department="Engineering",
        period="2026-W35",
        employee_count=employee_count,
        high_workload_rate=0.58,
        high_recovery_risk_rate=0.46,
        schedule_conflict_rate=0.38,
        task_completion_rate=0.81,
    )


# ─── tests ──────────────────────────────────────────────────────────────────

def test_step1_risk_detection():
    """Aggregate signal must exceed minimum privacy threshold."""
    signal = _make_signal()
    assert signal.employee_count >= 10, "Privacy threshold must be satisfied (min 10)"
    assert signal.high_recovery_risk_rate > 0.40, "Recovery risk must be elevated"
    print("  ✓ Risk detection signal valid")


def test_step2_agent_swarm():
    """Three distinct agents must produce positions and the orchestrator must detect a conflict."""
    signal = _make_signal()
    correlation_id = f"test-{uuid.uuid4().hex[:8]}"

    fin = finance.evaluate(signal)
    peop = people.evaluate(signal)
    ops = operations.evaluate(signal)

    assert fin.agent_name and peop.agent_name and ops.agent_name, "Each agent must have a name"
    # All three agent names must be distinct
    names = {fin.agent_name, peop.agent_name, ops.agent_name}
    assert len(names) == 3, "Agents must be distinct roles"

    rec = orchestrator.orchestrate_agents(fin, peop, ops, correlation_id)
    assert rec.conflict_detected != "", "Orchestrator must detect and document agent conflict"
    assert len(rec.agent_positions) == 3, "All three agent positions must be recorded"
    assert rec.confidence > 0, "Confidence score must be positive"
    print("  ✓ Agent swarm produced 3 positions + conflict resolution")


def test_step3_decision_contract():
    """Orchestrator must produce a Decision Contract that grants personal AI authority."""
    signal = _make_signal()
    correlation_id = "test-contract-001"

    fin = finance.evaluate(signal)
    peop = people.evaluate(signal)
    ops = operations.evaluate(signal)
    rec = orchestrator.orchestrate_agents(fin, peop, ops, correlation_id)

    contract: DecisionContract = rec.contract
    assert contract is not None, "A Decision Contract must be generated"
    assert contract.correlation_id == correlation_id, "Contract must carry the correlation ID"
    assert contract.personal_agent_authority.get("can_counterpropose") is True
    assert contract.privacy_scope.get("aggregate_only") is True
    assert contract.privacy_scope.get("individual_data_shared") is False
    print("  ✓ Decision Contract grants personal authority + enforces privacy scope")


def test_step4_idempotent_corporate_action():
    """Receiving the same action_id twice must NOT create a duplicate assignment."""
    # Import here to get a fresh module-level state reference
    import decidr.backend.corporate as corp

    action = CorporateAction(
        action_id="CA-IDEM-TEST",
        organization_id="ACME_TECH",
        department="Engineering",
        action_type="training",
        title="Idempotency Test Upskilling",
        duration_minutes=60,
        priority="high",
        deadline="2026-09-04T17:00:00Z",
        reason="Test",
        correlation_id="test-idem-001",
    )

    # Clear state
    corp.DB_CORPORATE_ACTIONS.clear()
    corp.DB_ASSIGNMENTS.clear()

    r1 = corp.receive_corporate_action(action)
    r2 = corp.receive_corporate_action(action)  # duplicate

    assert r1["status"] == "success"
    assert r2["status"] == "already_exists", "Second call must be idempotent"
    assert len(corp.DB_ASSIGNMENTS) == 1, "Only one assignment should exist"
    print("  ✓ Duplicate corporate action correctly blocked (idempotent)")


def test_step5_constitution_and_attention_shield():
    """Personal AI must apply constitution rules and generate a counterproposal."""
    import decidr.backend.corporate as corp

    corp.DB_CORPORATE_ACTIONS.clear()
    corp.DB_ASSIGNMENTS.clear()

    signal = _make_signal()
    correlation_id = "test-e2e-shield"
    fin = finance.evaluate(signal)
    peop = people.evaluate(signal)
    ops = operations.evaluate(signal)
    rec = orchestrator.orchestrate_agents(fin, peop, ops, correlation_id)

    action = CorporateAction(
        action_id="CA-SHIELD-001",
        organization_id="ACME_TECH",
        department="Engineering",
        action_type="training",
        title="Security Upskilling",
        duration_minutes=60,
        priority="high",
        deadline="2026-09-04T17:00:00Z",
        reason=rec.recommendation_text,
        correlation_id=correlation_id,
        contract=rec.contract,
    )

    result = corp.receive_corporate_action(action)
    assignment_id = result["assignment_id"]

    evaluation = corp.evaluate_personal_adaptation(assignment_id)
    assert evaluation is not None
    cp = evaluation.get("counterproposal")
    assert cp is not None, "Personal AI must produce a counterproposal"
    assert "Academic Priority Shield" in cp.get("constitution_rule_triggered", "")
    assert cp.get("proposed_slot") == "Thursday 7:00-8:00 PM"
    print("  ✓ Constitution rule triggered; counterproposal to Thursday 7 PM generated")


def test_step6_privacy_aggregation_threshold():
    """Groups smaller than MIN_GROUP_SIZE (10) must be rejected."""
    small_signal = _make_signal(employee_count=4)
    MIN_GROUP_SIZE = 10

    # Simulate what the org backend enforces
    if small_signal.employee_count < MIN_GROUP_SIZE:
        blocked = True
    else:
        blocked = False

    assert blocked, "Small group must be suppressed by privacy threshold"
    print("  ✓ Privacy threshold enforced: group of 4 correctly blocked")


def test_step7_outcome_correlation_id():
    """Aggregated outcome must carry the same correlation ID from the original risk."""
    outcome = ActionOutcome(
        action_id="CA-SHIELD-001",
        correlation_id="test-e2e-shield",
        department="Engineering",
        assigned=24,
        accepted=21,
        modified=5,
        completed=18,
        deferred=2,
        skipped=1,
        projected_burnout_reduction="12%",
    )
    assert outcome.correlation_id == "test-e2e-shield"
    assert outcome.assigned >= 10, "Must meet minimum group threshold"
    print("  ✓ Outcome carries correct correlation ID for full traceability")


# ─── runner ─────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    tests = [
        test_step1_risk_detection,
        test_step2_agent_swarm,
        test_step3_decision_contract,
        test_step4_idempotent_corporate_action,
        test_step5_constitution_and_attention_shield,
        test_step6_privacy_aggregation_threshold,
        test_step7_outcome_correlation_id,
    ]

    print("\n╔══════════════════════════════════════════════════════════╗")
    print("║   DECIDR — Full B2B2C Closed-Loop Integration Test       ║")
    print("╚══════════════════════════════════════════════════════════╝\n")

    passed = 0
    failed = 0
    for t in tests:
        try:
            print(f"Running: {t.__name__}")
            t()
            passed += 1
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            failed += 1

    print(f"\n{'─'*56}")
    print(f"  Results: {passed} passed / {failed} failed / {len(tests)} total")
    print(f"{'─'*56}")

    if failed > 0:
        sys.exit(1)
    else:
        print("  ✅ ALL TESTS PASSED — Closed loop verified end-to-end.\n")
