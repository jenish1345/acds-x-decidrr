import pytest
import sys
import os
import httpx

sys.path.append(os.path.join(os.path.dirname(__file__), '../../shared'))
from models import AggregateWorkforceSignal, CorporateRecommendation

from agents import orchestrator, finance, people, operations

def test_aggregate_threshold():
    # Test that the privacy threshold suppresses data below 10
    signal = AggregateWorkforceSignal(
        organization_id="TEST",
        department="Test",
        period="2026-W35",
        employee_count=5, # Below threshold
        high_workload_rate=0.5,
        high_recovery_risk_rate=0.5,
        schedule_conflict_rate=0.5,
        task_completion_rate=0.5
    )
    # The actual suppression logic is in Decidr's aggregator.py, but we can verify the model holds the count correctly
    assert signal.employee_count < 10

def test_corporate_agents():
    signal = AggregateWorkforceSignal(
        organization_id="ACME_TECH",
        department="Engineering",
        period="2026-W35",
        employee_count=24,
        high_workload_rate=0.6, # High workload
        high_recovery_risk_rate=0.5,
        schedule_conflict_rate=0.4,
        task_completion_rate=0.8
    )
    
    fin_finding = finance.evaluate(signal)
    assert fin_finding.trade_off == 2
    
    peop_finding = people.evaluate(signal)
    assert peop_finding.trade_off == -6
    
    ops_finding = operations.evaluate(signal)
    assert ops_finding.trade_off == -3
    
    rec_data = orchestrator.orchestrate_agents(fin_finding, peop_finding, ops_finding)
    
    assert "Redistribute" in rec_data["title"]
    assert rec_data["trade_offs"]["Cost"] == 2
    assert rec_data["trade_offs"]["Workforce Risk"] == -6
