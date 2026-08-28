"""Operations Corporate Agent."""

import sys
import os
from pathlib import Path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from shared.contracts import AggregateWorkforceSignal
from .orchestrator import AgentFinding

def evaluate(signal: AggregateWorkforceSignal) -> AgentFinding:
    """Evaluate operational risks based on workforce signals."""
    if signal.task_completion_rate < 0.85 or signal.schedule_conflict_rate > 0.3:
        return AgentFinding(
            agent_name="OPERATIONS AGENT",
            finding="Removing training creates capability risk, but current schedule conflicts are causing delivery delays.",
            impact="Medium delivery risk",
            confidence=0.84,
            trade_off=-3
        )
        
    return AgentFinding(
        agent_name="OPERATIONS AGENT",
        finding="Operations are running smoothly.",
        impact="Low",
        confidence=0.92,
        trade_off=0
    )
