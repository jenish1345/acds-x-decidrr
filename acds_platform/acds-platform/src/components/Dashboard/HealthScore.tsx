import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { CompanyHealth } from '../../types';

interface HealthScoreProps {
  health: CompanyHealth;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ health }) => {
  const getStatusColor = () => {
    if (health.riskStatus === 'critical') return 'text-status-critical';
    if (health.riskStatus === 'warning') return 'text-status-warning';
    return 'text-status-healthy';
  };

  const getStatusBg = () => {
    if (health.riskStatus === 'critical') return 'bg-red-50 border-red-200';
    if (health.riskStatus === 'warning') return 'bg-amber-50 border-amber-200';
    return 'bg-green-50 border-green-200';
  };

  const TrendIcon = health.trend === 'up' ? TrendingUp : health.trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="card-enterprise p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-2">COMPANY HEALTH SCORE</p>
          <div className="flex items-baseline space-x-3">
            <h2 className={`text-5xl font-semibold ${getStatusColor()}`}>{health.overallScore}</h2>
            <span className="text-gray-400 text-lg">/100</span>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendIcon size={16} className={getStatusColor()} />
            <span className="text-sm text-gray-600">
              {health.trend === 'down' ? 'Declining' : health.trend === 'up' ? 'Improving' : 'Stable'}
            </span>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-sm border ${getStatusBg()}`}>
          <p className="text-xs text-gray-600 mb-1">STATUS</p>
          <p className={`text-sm font-semibold uppercase ${getStatusColor()}`}>
            {health.riskStatus}
          </p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last Updated: {new Date(health.lastUpdated).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};
