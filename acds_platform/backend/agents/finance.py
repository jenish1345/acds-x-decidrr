"""Finance Corporate Agent."""

import sys
import os
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from shared.contracts import AggregateWorkforceSignal
from .orchestrator import AgentFinding

def evaluate(signal: AggregateWorkforceSignal) -> AgentFinding:
    """Evaluate financial risks based on workforce signals."""
    if signal.high_workload_rate > 0.5:
        return AgentFinding(
            agent_name="FINANCE AGENT",
            finding="Training initiative increases cost and reduces billable hours.",
            impact="High cost impact",
            confidence=0.80,
            trade_off=2
        )
    
    return AgentFinding(
        agent_name="FINANCE AGENT",
        finding="Current operations are within budget parameters.",
        impact="Low",
        confidence=0.90,
        trade_off=0
    )
