import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI } from '../../types';

interface KPICardProps {
  kpi: KPI;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
  const trendColor = kpi.trend === 'up' ? 'text-status-healthy' : kpi.trend === 'down' ? 'text-status-critical' : 'text-gray-400';

  return (
    <div className="card-enterprise p-5">
      <p className="text-xs text-gray-500 font-medium mb-3">{kpi.label.toUpperCase()}</p>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-semibold text-gray-900">{kpi.value}</h3>
        <div className={`flex items-center space-x-1 ${trendColor}`}>
          <TrendIcon size={16} />
          <span className="text-sm font-medium">{Math.abs(kpi.change)}%</span>
        </div>
      </div>
    </div>
  );
};
