"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = "http://localhost:8000/api";

export default function CorporateTasksPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<Record<string, string>>({});

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${API_URL}/corporate/assignments`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.filter((d: any) => d !== null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
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
        
        // 2. Trigger privacy aggregation to push outcome to ACDS (simulating async background task)
        await fetch(`${API_URL}/integration/send_outcome/${actionId}/Engineering`, {
          method: 'POST'
        });
        
        alert(`Action ${status}. Aggregated outcome sent to ACDS.`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process action.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="gradient-bg min-h-screen flex flex-col p-8">
      <nav className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full mb-12">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--primary-light)]">
          ← Back to Decidr
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        <h1 className="text-3xl font-bold mb-8">Corporate Tasks</h1>

        {assignments.length === 0 ? (
          <div className="glass-card p-8 text-center text-gray-400">
            No corporate tasks assigned to you right now.
          </div>
        ) : (
          assignments.map((assignment: any) => {
            const { action, recommended_slot, reasoning, assignment_id } = assignment;
            const status = actionStatus[assignment_id] || action.status || "PENDING";

            return (
              <div key={assignment_id} className="glass-card p-6 border-l-4 border-[var(--primary-light)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{action.title}</h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{action.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                      {action.priority} Priority
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Due: {new Date(action.deadline).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-[var(--primary-light)] mb-2 flex items-center gap-2">
                    <span>⚡</span> Decidr Personal Adaptation
                  </h3>
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Recommended Slot:</div>
                      <div className="font-mono text-white bg-black/50 px-3 py-1 rounded inline-block">
                        {recommended_slot}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">Why:</div>
                      <ul className="text-sm text-gray-300 space-y-1 list-disc pl-4">
                        {reasoning.map((r: string, idx: number) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {status === "PENDING" ? (
                  <div className="flex gap-3">
                    <button 
                      disabled={loading}
                      onClick={() => handleAction(assignment_id, action.action_id, 'ACCEPTED')} 
                      className="btn-primary flex-1 py-2 text-sm bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] border-green-500"
                    >
                      ✓ Accept Schedule
                    </button>
                    <button 
                      disabled={loading}
                      onClick={() => handleAction(assignment_id, action.action_id, 'MODIFIED')} 
                      className="btn-secondary flex-1 py-2 text-sm"
                    >
                      ✎ Modify
                    </button>
                    <button 
                      disabled={loading}
                      onClick={() => handleAction(assignment_id, action.action_id, 'DEFERRED')} 
                      className="btn-secondary flex-1 py-2 text-sm text-red-400 hover:text-red-300"
                    >
                      ⏱ Defer
                    </button>
                  </div>
                ) : (
                  <div className={`text-center py-2 rounded-lg font-bold ${status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-300'}`}>
                    Status: {status}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
