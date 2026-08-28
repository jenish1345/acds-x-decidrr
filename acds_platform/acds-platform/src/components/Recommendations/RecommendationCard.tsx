import React from 'react';
import { CheckCircle2, Clock, User } from 'lucide-react';
import type { Recommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getPriorityStyles = () => {
    switch (recommendation.priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getEffortStyles = () => {
    switch (recommendation.effort) {
      case 'high':
        return 'text-red-700';
      case 'medium':
        return 'text-amber-700';
      default:
        return 'text-green-700';
    }
  };

  return (
    <div className="card-enterprise p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex-1">{recommendation.title}</h3>
        <span className={`status-badge border ${getPriorityStyles()}`}>
          {recommendation.priority.toUpperCase()}
        </span>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">{recommendation.description}</p>

      <div className="bg-green-50 border border-green-200 rounded-sm p-4 mb-4">
        <div className="flex items-start space-x-2">
          <CheckCircle2 className="text-status-healthy mt-0.5" size={16} />
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">EXPECTED OUTCOME</p>
            <p className="text-sm text-gray-900">{recommendation.expectedOutcome}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Timeline</p>
            <p className="text-sm font-medium text-gray-900">{recommendation.timeline}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${getEffortStyles()}`} style={{ backgroundColor: 'currentColor', opacity: 0.2 }} />
          <div>
            <p className="text-xs text-gray-500">Effort</p>
            <p className={`text-sm font-medium ${getEffortStyles()}`}>{recommendation.effort.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <User size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Owner</p>
            <p className="text-sm font-medium text-gray-900">{recommendation.owner}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
