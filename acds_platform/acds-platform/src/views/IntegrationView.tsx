import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, TrendingUp, CheckCircle, Activity, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = "http://localhost:8001/api/integration";

export const IntegrationView: React.FC = () => {
  const [signal, setSignal] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [outcome, setOutcome] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionDispatched, setActionDispatched] = useState(false);

  const fetchSignal = async () => {
    try {
      // Hardcode Acme Tech / Engineering for demo
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
        setRecommendation(await res.json());
        toast.success("Corporate Agents completed analysis.");
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
        toast.success("Corporate Action Dispatched to Decidr!");
        setActionDispatched(true);
        // Begin polling for outcome
        pollOutcome(data.action.action_id);
      }
    } catch (err) {
      toast.error("Dispatch failed. Is Decidr running?");
    } finally {
      setLoading(false);
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
            toast.success("Received aggregated closed-loop outcome!");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">B2B2C Closed-Loop Integration</h1>
          <p className="text-sm text-gray-600">Company Brain (ACDS) ↔ Personal Execution (Decidr)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workforce Risk Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-corporate-navy" />
              Aggregate Workforce Risk (Engineering)
            </h2>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">ELEVATED</span>
          </div>

          {signal ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Employee Count</div>
                  <div className="text-xl font-semibold">{signal.employee_count}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Workload Risk</div>
                  <div className="text-xl font-semibold text-red-600">{(signal.high_workload_rate * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Recovery Risk</div>
                  <div className="text-xl font-semibold text-red-600">{(signal.high_recovery_risk_rate * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Schedule Conflicts</div>
                  <div className="text-xl font-semibold text-orange-500">{(signal.schedule_conflict_rate * 100).toFixed(0)}%</div>
                </div>
              </div>
              <button
                onClick={generateRecommendation}
                disabled={loading || recommendation}
                className="w-full mt-4 btn-primary flex justify-center items-center"
              >
                {loading ? 'Analyzing...' : (recommendation ? 'Analyzed' : 'Investigate with Corporate Agents')}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading aggregated signals...</p>
          )}
        </div>

        {/* Recommendation Panel */}
        {recommendation && (
          <div className="bg-white rounded-xl shadow-sm border border-corporate-navy p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-corporate-navy"></div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2 text-corporate-navy" />
                Corporate Recommendation
              </h2>
              <div className="text-right">
                <div className="text-xs text-gray-500">Confidence</div>
                <div className="text-lg font-bold text-green-600">{recommendation.confidence}%</div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-md">{recommendation.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{recommendation.recommendation_text}</p>
            </div>

            <div className="mb-4 bg-gray-50 p-3 rounded-lg text-xs font-mono text-gray-600">
              <div className="font-semibold mb-1">Agent Trade-offs:</div>
              {recommendation.evidence.map((ev: string, idx: number) => (
                <div key={idx}>- {ev}</div>
              ))}
            </div>

            {!actionDispatched ? (
              <div className="flex space-x-3">
                <button onClick={approveRecommendation} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition">
                  APPROVE
                </button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition">
                  REJECT
                </button>
              </div>
            ) : (
              <div className="text-center p-2 bg-green-50 text-green-700 rounded-lg font-semibold flex justify-center items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Action Dispatched to Decidr
              </div>
            )}
          </div>
        )}
      </div>

      {/* Closed Loop Outcome Panel */}
      {outcome && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-corporate-navy" />
              Intervention Outcome (Aggregated)
            </h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">CLOSED LOOP</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 uppercase">Assigned</div>
              <div className="text-2xl font-bold">{outcome.assigned}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-green-600 uppercase">Accepted</div>
              <div className="text-2xl font-bold text-green-700">{outcome.accepted}</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 uppercase">Modified</div>
              <div className="text-2xl font-bold text-blue-700">{outcome.modified}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xs text-purple-600 uppercase">Completed</div>
              <div className="text-2xl font-bold text-purple-700">{outcome.completed}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xs text-orange-600 uppercase">Deferred</div>
              <div className="text-2xl font-bold text-orange-700">{outcome.deferred}</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex items-start">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900">Observed change after intervention</h4>
              <p className="text-sm text-blue-800 mt-1">
                Aggregated signals indicate a projected 12% reduction in schedule conflicts and stabilized recovery risks across the department.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
