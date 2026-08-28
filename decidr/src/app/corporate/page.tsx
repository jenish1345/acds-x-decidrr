"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = "http://localhost:8000/api";

export default function CorporateTasksPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [constitution, setConstitution] = useState<any[]>([]);
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      const [resAssignments, resConst, resBudget] = await Promise.all([
        fetch(`${API_URL}/corporate/assignments`),
        fetch(`${API_URL}/personal/constitution`),
        fetch(`${API_URL}/personal/attention-budget`)
      ]);

      if (resAssignments.ok) {
        const data = await resAssignments.json();
        setAssignments(data.filter((d: any) => d !== null));
      }
      if (resConst.ok) {
        setConstitution(await resConst.json());
      }
      if (resBudget.ok) {
        setBudget(await resBudget.json());
      }
    } catch (err) {
      console.error("Failed to load personal data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (assignmentId: string, actionId: string, status: string) => {
    setLoading(true);
    try {
      // 1. Update Decidr local status
      const res = await fetch(`${API_URL}/corporate/assignments/${assignmentId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        setActionStatus(prev => ({ ...prev, [assignmentId]: status }));
        
        // 2. Trigger privacy aggregation to push outcome to Organization layer
        await fetch(`${API_URL}/integration/send_outcome/${actionId}/Engineering`, {
          method: 'POST'
        });
        
        alert(`Action ${status}. Privacy-safe aggregated outcome dispatched to Organization Mode.`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process action.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="gradient-bg min-h-screen flex flex-col p-6 sm:p-10">
      <nav className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full mb-8">
        <Link href="/" className="text-sm font-semibold tracking-tight text-blue-400 hover:text-blue-300 flex items-center gap-1">
          ← Back to Daily Decision Engine
        </Link>
        <span className="text-xs px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full font-mono">
          DECIDR PERSONAL MODE
        </span>
      </nav>

      <div className="max-w-5xl mx-auto w-full space-y-8">
        {/* Top Header & Attention Budget Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Personal Action Inbox & Attention Shield</h1>
            <p className="text-sm text-slate-400 mt-1">
              Your Personal AI negotiates corporate demands against your exams, sleep, and attention capacity.
            </p>
          </div>

          {budget && (
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 min-w-[220px]">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
                <span>🛡 Attention Budget</span>
                <span className="text-emerald-400 font-mono">{budget.available_points} / {budget.daily_budget_points} pts left</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${(budget.available_points / budget.daily_budget_points) * 100}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Status: <strong className="text-emerald-400">{budget.shield_status}</strong></div>
            </div>
          )}
        </div>

        {/* Active Personal Constitution Rules */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>📜</span> Active Personal Constitution Rules (My DECIDR Rules)
            </h3>
            <span className="text-[10px] text-blue-400 font-mono">Zero Corporate Override Allowed</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {constitution.map((rule: any) => (
              <div key={rule.rule_id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-xs">
                <div className="font-bold text-white mb-0.5 flex justify-between">
                  <span>{rule.name}</span>
                  <span className="text-[10px] bg-blue-900/80 text-blue-300 px-1.5 py-0.5 rounded font-mono">{rule.policy}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Tasks & Inbound Contracts */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📥</span> Inbound Corporate Decision Contracts
          </h2>

          {assignments.length === 0 ? (
            <div className="glass-card p-10 text-center text-slate-400">
              No pending corporate tasks assigned. Your schedule is completely clear!
            </div>
          ) : (
            assignments.map((assignment: any) => {
              const { action, contract, counterproposal, assignment_id, attention_cost } = assignment;
              const status = actionStatus[assignment_id] || assignment.status || "PENDING";

              return (
                <div key={assignment_id} className="glass-card p-6 border-l-4 border-blue-500 rounded-xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{action.title}</h3>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase">
                          {action.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{action.description}</p>
                    </div>

                    <div className="text-left sm:text-right text-xs">
                      <div className="text-slate-400">Attention Load: <span className="font-bold text-white">{attention_cost} pts</span></div>
                      <div className="text-slate-500 text-[11px] mt-0.5">Correlation: <span className="font-mono">{action.correlation_id || "corr-local"}</span></div>
                    </div>
                  </div>

                  {/* Decision Contract Summary */}
                  {contract && (
                    <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/40 mb-4 text-xs font-mono">
                      <div className="text-[11px] text-slate-300 font-sans font-semibold mb-1">
                        📋 Inbound Decision Contract Terms:
                      </div>
                      <div className="text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                        <div>• Duration: <strong>{action.duration_minutes} min</strong></div>
                        <div>• Authority: <strong>Full Personal AI Delegation</strong></div>
                        <div>• Privacy: <strong>Zero-Knowledge Aggregate Only</strong></div>
                        <div>• Organization Need: <strong>{contract.objective}</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Personal AI Counterproposal Shield */}
                  {counterproposal && (
                    <div className="bg-gradient-to-br from-blue-950/40 to-slate-900/60 rounded-xl p-4 mb-6 border border-blue-500/30 shadow-inner">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-blue-300 text-sm flex items-center gap-1.5">
                          <span>⚡</span> Personal AI Counterproposal & Attention Shield
                        </h4>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-mono">
                          {counterproposal.constitution_rule_triggered}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                        <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Original Request</div>
                          <div className="text-sm font-mono text-red-400 line-through mt-0.5">{counterproposal.original_requested}</div>
                        </div>
                        <div className="bg-slate-900/70 p-3 rounded-lg border border-emerald-500/40 shadow-sm">
                          <div className="text-[10px] text-emerald-400 uppercase font-bold">AI Counterproposed Slot</div>
                          <div className="text-sm font-mono text-emerald-300 font-bold mt-0.5">{counterproposal.proposed_slot}</div>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
                        <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Protection Reasoning:</div>
                        <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                          {counterproposal.reasons.map((r: string, idx: number) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {status === "PENDING" || status === "COUNTERPROPOSED" ? (
                    <div className="flex flex-wrap gap-3">
                      <button 
                        disabled={loading}
                        onClick={() => handleAction(assignment_id, action.action_id, 'COUNTERPROPOSAL_ACCEPTED')} 
                        className="btn-primary flex-1 py-2.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg border-emerald-500 transition flex items-center justify-center gap-1.5"
                      >
                        ✓ Accept AI Counterproposal (Thursday 7 PM)
                      </button>
                      <button 
                        disabled={loading}
                        onClick={() => handleAction(assignment_id, action.action_id, 'MODIFIED')} 
                        className="btn-secondary py-2.5 px-4 text-xs font-semibold"
                      >
                        ✎ Modify Slot
                      </button>
                      <button 
                        disabled={loading}
                        onClick={() => handleAction(assignment_id, action.action_id, 'DEFERRED')} 
                        className="btn-secondary py-2.5 px-4 text-xs font-semibold text-amber-400 hover:text-amber-300"
                      >
                        ⏱ Defer
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-bold text-center">
                      ✓ Status: {status} • Dispatched to Corporate Aggregator (Privacy Protected)
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
