import React, { useState } from 'react';
import { RecommendationCard } from '../components/Recommendations/RecommendationCard';
import { recommendations } from '../data/mockData';

export const RecommendationsView: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState<string>('all');

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
        {sortedRecommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
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
