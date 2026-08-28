"""People / Workforce Corporate Agent."""

import sys
import os
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from shared.contracts import AggregateWorkforceSignal
from .orchestrator import AgentFinding

def evaluate(signal: AggregateWorkforceSignal) -> AgentFinding:
    """Evaluate workforce burnout and satisfaction risks."""
    if signal.high_workload_rate > 0.5 or signal.high_recovery_risk_rate > 0.4:
        return AgentFinding(
            agent_name="WORKFORCE AGENT",
            finding="Not addressing overload increases workforce risk. Burnout risk is critical.",
            impact="High retention risk",
            confidence=0.88,
            trade_off=-6
        )
        
    return AgentFinding(
        agent_name="WORKFORCE AGENT",
        finding="Workforce metrics are stable.",
        impact="Low",
        confidence=0.90,
        trade_off=0
    )
