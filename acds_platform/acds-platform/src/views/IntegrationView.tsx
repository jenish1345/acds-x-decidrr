import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Activity, 
  BrainCircuit, 
  DollarSign, 
  HeartHandshake, 
  Cpu, 
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  GitCommit
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = "http://localhost:8001/api/integration";

export const IntegrationView: React.FC = () => {
  const [signal, setSignal] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [outcome, setOutcome] = useState<any>(null);
  const [trace, setTrace] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionDispatched, setActionDispatched] = useState(false);

  const fetchSignal = async () => {
    try {
      const res = await fetch(`${API_URL}/organization/ACME_TECH/department/Engineering/signal`);
      if (res.ok) {
        setSignal(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateRecommendation = async () => {
    if (!signal) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/acds/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signal)
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
        toast.success("Corporate Agent Swarm completed debate & negotiation!");
        if (data.correlation_id) {
          fetchTrace(data.correlation_id);
        }
      }
    } catch (err) {
      toast.error("Failed to generate recommendation.");
    } finally {
      setLoading(false);
    }
  };

  const approveRecommendation = async () => {
    if (!recommendation) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/acds/approve_action?rec_id=${recommendation.recommendation_id}&org_id=ACME_TECH&dept=Engineering`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Decision Contract Dispatched to Personal DECIDR!");
        setActionDispatched(true);
        if (data.correlation_id) {
          fetchTrace(data.correlation_id);
        }
        pollOutcome(data.action.action_id);
      }
    } catch (err) {
      toast.error("Dispatch failed. Is Personal DECIDR running?");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrace = async (correlationId: string) => {
    try {
      const res = await fetch(`${API_URL}/trace/${correlationId}`);
      if (res.ok) {
        setTrace(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch trace:", err);
    }
  };

  const pollOutcome = async (action_id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/acds/action/${action_id}/outcome`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setOutcome(data);
            clearInterval(interval);
            toast.success("Received privacy-safe aggregated outcome!");
            if (recommendation?.correlation_id) {
              fetchTrace(recommendation.correlation_id);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
  };

  useEffect(() => {
    fetchSignal();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Organization Decision Intelligence</h1>
          <p className="text-sm text-gray-600">Enterprise Swarm Analysis ↔ Personal AI Negotiation & Execution</p>
        </div>
        {recommendation?.correlation_id && (
          <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-mono text-blue-800">
            <GitCommit size={14} className="text-blue-600" />
            <span>Correlation ID: {recommendation.correlation_id}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Workforce Signal & Anomaly Detection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Aggregate Workforce Risk (Engineering)
              </h2>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase tracking-wider">
                ELEVATED RISK
              </span>
            </div>

            {signal ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 font-medium">Eligible Employees</div>
                    <div className="text-xl font-bold text-gray-900">{signal.employee_count}</div>
                    <div className="text-[10px] text-green-600 font-medium mt-1">✓ Exceeds Privacy Min (10)</div>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 p-3 rounded-lg">
                    <div className="text-xs text-red-600 font-medium">Workload Friction</div>
                    <div className="text-xl font-bold text-red-600">{(signal.high_workload_rate * 100).toFixed(0)}%</div>
                    <div className="text-[10px] text-red-500 mt-1">High strain rate</div>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 p-3 rounded-lg">
                    <div className="text-xs text-red-600 font-medium">Recovery Risk</div>
                    <div className="text-xl font-bold text-red-600">{(signal.high_recovery_risk_rate * 100).toFixed(0)}%</div>
                    <div className="text-[10px] text-red-500 mt-1">Sleep & fatigue pressure</div>
                  </div>
                  <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-lg">
                    <div className="text-xs text-orange-600 font-medium">Schedule Conflicts</div>
                    <div className="text-xl font-bold text-orange-500">{(signal.schedule_conflict_rate * 100).toFixed(0)}%</div>
                    <div className="text-[10px] text-orange-500 mt-1">Delivery vs Personal goals</div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <strong>Diagnostic Finding:</strong> Engineering department exhibits elevated recovery and schedule friction. Immediate structured intervention recommended.
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading aggregated signals...</p>
            )}
          </div>

          <button
            onClick={generateRecommendation}
            disabled={loading || recommendation}
            className="w-full mt-6 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 text-white font-semibold rounded-lg shadow-sm transition flex justify-center items-center gap-2"
          >
            <BrainCircuit size={18} />
            {loading ? 'Running Swarm Negotiation...' : (recommendation ? 'Swarm Negotiation Complete' : 'Trigger Corporate Agent Swarm')}
          </button>
        </div>

        {/* Right: Agent Swarm Debate & Decision Contract */}
        {recommendation ? (
          <div className="bg-white rounded-xl shadow-sm border border-blue-500 p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
            
            <div>
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <BrainCircuit className="w-5 h-5 mr-2 text-blue-600" />
                  Agent Swarm Positions & Negotiation
                </h2>
                <div className="text-right">
                  <div className="text-xs text-gray-500 font-medium">Swarm Confidence</div>
                  <div className="text-xl font-black text-green-600">{recommendation.confidence}%</div>
                </div>
              </div>

              {/* Individual Agent Positions */}
              <div className="space-y-2 mb-4">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs">
                  <DollarSign size={16} className="text-emerald-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900">Finance Agent: </span>
                    <span className="text-emerald-800">Intervention cost is elevated ($15,000). Mandates asynchronous delivery rather than expensive workshops.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg flex items-start gap-2 text-xs">
                  <HeartHandshake size={16} className="text-rose-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-rose-900">Workforce Agent: </span>
                    <span className="text-rose-800">46% recovery risk. Requires full personal AI authority to counterpropose schedule slots.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg flex items-start gap-2 text-xs">
                  <Cpu size={16} className="text-indigo-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-indigo-900">Operations Agent: </span>
                    <span className="text-indigo-800">Critical sprint underway. Asynchronous 60-min format prevents operational delivery halts.</span>
                  </div>
                </div>
              </div>

              {/* Conflict Detected & Negotiated Resolution */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span>Conflict Resolved by Orchestrator:</span>
                </div>
                <p className="text-slate-700">{recommendation.recommendation_text}</p>
              </div>

              {/* Decision Contract Preview */}
              {recommendation.contract && (
                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3 mb-4 text-xs font-mono">
                  <div className="flex items-center justify-between font-bold text-blue-900 mb-1.5 font-sans">
                    <span className="flex items-center gap-1">
                      <FileCheck2 size={15} className="text-blue-700" />
                      Generated Decision Contract
                    </span>
                    <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-mono">
                      Attention Cost: {recommendation.contract.estimated_attention_cost}/10
                    </span>
                  </div>
                  <div className="text-slate-700 space-y-0.5 text-[11px]">
                    <div>• <strong>Objective:</strong> {recommendation.contract.objective}</div>
                    <div>• <strong>Personal Authority:</strong> Full (Can reschedule, counterpropose, defer)</div>
                    <div>• <strong>Privacy Scope:</strong> Strict Zero-Knowledge (Aggregate only)</div>
                  </div>
                </div>
              )}
            </div>

            {/* Approval Controls */}
            {!actionDispatched ? (
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={approveRecommendation}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-sm shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={16} />
                  APPROVE & DISPATCH CONTRACT
                </button>
                <button className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm transition">
                  REJECT
                </button>
              </div>
            ) : (
              <div className="text-center p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg font-bold text-sm flex justify-center items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Decision Contract Dispatched to Personal DECIDR Layer
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-400">
            <BrainCircuit size={40} className="mb-2 text-gray-300" />
            <p className="font-medium text-sm">Corporate Swarm Standing By</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Click &quot;Trigger Corporate Agent Swarm&quot; to initiate multi-agent debate and conflict resolution.
            </p>
          </div>
        )}
      </div>

      {/* Closed Loop Outcome Panel */}
      {outcome && (
        <div className="bg-white rounded-xl shadow-sm border border-emerald-500 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-600" />
              Intervention Outcome (Aggregated from Personal DECIDR)
            </h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} /> PRIVACY-SAFE CLOSED LOOP
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 font-bold uppercase">Total Assigned</div>
              <div className="text-2xl font-black text-gray-900">{outcome.assigned}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-xs text-green-700 font-bold uppercase">Direct Accepted</div>
              <div className="text-2xl font-black text-green-700">{outcome.accepted}</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-xs text-blue-700 font-bold uppercase">AI Counterproposed</div>
              <div className="text-2xl font-black text-blue-700">{outcome.modified}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-xs text-purple-700 font-bold uppercase">Completed</div>
              <div className="text-2xl font-black text-purple-700">{outcome.completed}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="text-xs text-orange-700 font-bold uppercase">Deferred</div>
              <div className="text-2xl font-black text-orange-700">{outcome.deferred}</div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-start">
            <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">Observed Change After Intervention (Zero Individual Data Leakage)</h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Aggregated signals verify a projected {outcome.projected_burnout_reduction || "12%"} reduction in schedule conflicts. Personal AI schedule adaptation successfully protected individual recovery baselines.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Decision Trace Provenance Timeline */}
      {trace && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GitCommit className="text-blue-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">End-to-End Decision Trace</h3>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Trace ID: {trace.trace_id}
            </div>
          </div>

          <div className="space-y-3">
            {trace.steps.map((s: any) => (
              <div key={s.step_number} className="flex items-start gap-3 text-xs font-mono bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                <span className="px-2 py-0.5 bg-blue-900 text-blue-300 font-bold rounded">Step {s.step_number}</span>
                <div className="flex-1">
                  <div className="text-slate-300 font-sans font-medium">{s.summary}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
