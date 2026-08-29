import React, { useState } from 'react';
import { RecommendationCard } from '../components/Recommendations/RecommendationCard';
import { useDatasetStore } from '../store/datasetStore';
import { NoDatasetEmptyState } from '../components/Common/NoDatasetEmptyState';
import type { Recommendation } from '../types';

interface RecommendationsViewProps {
  onNavigate?: (view: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ onNavigate }) => {
  const currentDataset = useDatasetStore((state) => state.currentDataset);
  const alerts = useDatasetStore((state) => state.dynamicAlerts) || [];

  const [filterPriority, setFilterPriority] = useState<string>('all');

  if (!currentDataset) {
    return (
      <NoDatasetEmptyState
        title="Strategic Recommendations"
        description="Upload a company dataset to generate automated strategic recommendations targeted at your specific operational risks."
        onNavigate={onNavigate}
      />
    );
  }

  const recommendations: Recommendation[] = alerts.map((alert) => ({
    id: `REC_${alert.id}`,
    alertId: alert.id,
    title: `Remediate ${alert.title}`,
    description: `Execute mitigation strategy for ${alert.department} to resolve flagged anomaly: "${alert.description}". Focus on stabilizing: ${alert.affectedMetrics?.join(', ') || 'core operational indicators'}.`,
    priority: alert.severity === 'critical' ? 'critical' : 'high',
    expectedOutcome: `Reduce risk exposure and restore ${alert.department} metrics to nominal operating range.`,
    effort: alert.severity === 'critical' ? 'high' : 'medium',
    timeline: alert.severity === 'critical' ? '30 days' : '60 days',
    owner: `VP / Head of ${alert.department}`
  }));

  const filteredRecommendations = recommendations.filter(rec => {
    if (filterPriority !== 'all' && rec.priority !== filterPriority) return false;
    return true;
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedRecommendations = [...filteredRecommendations].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Strategic Recommendations</h1>
        <p className="text-sm text-gray-600">Actionable initiatives to mitigate identified risks</p>
      </div>

      <div className="card-enterprise p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Filter by Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm border border-gray-300 rounded-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-corporate-navy"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {sortedRecommendations.length} recommendation{sortedRecommendations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedRecommendations.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500 text-sm">
            No recommendations required. All operational areas in this dataset are operating within target parameters.
          </div>
        ) : (
          sortedRecommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))
        )}
      </div>

      <div className="card-enterprise p-6 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">IMPLEMENTATION OVERVIEW</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-semibold text-status-critical mb-1">
              {recommendations.filter(r => r.priority === 'critical').length}
            </p>
            <p className="text-xs text-gray-600">Critical Priority</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold text-orange-600 mb-1">
              {recommendations.filter(r => r.priority === 'high').length}
            </p>
            <p className="text-xs text-gray-600">High Priority</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold text-corporate-navy mb-1">
              {recommendations.reduce((sum, r) => {
                const days = parseInt(r.timeline);
                return sum + (isNaN(days) ? 0 : days);
              }, 0)}
            </p>
            <p className="text-xs text-gray-600">Total Days</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              {new Set(recommendations.map(r => r.owner)).size}
            </p>
            <p className="text-xs text-gray-600">Stakeholders</p>
          </div>
        </div>
      </div>
    </div>
  );
};
