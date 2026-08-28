import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import type { RootCause } from '../../types';

interface RootCauseViewProps {
  rootCause: RootCause;
}

export const RootCauseView: React.FC<RootCauseViewProps> = ({ rootCause }) => {
  return (
    <div className="space-y-6">
      <div className="card-enterprise p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Target className="text-corporate-navy mt-1" size={20} />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">PRIMARY ROOT CAUSE</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{rootCause.primaryCause}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">CONFIDENCE</p>
            <p className="text-lg font-semibold text-corporate-navy">{rootCause.confidence}%</p>
          </div>
        </div>
      </div>

      <div className="card-enterprise p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">CONTRIBUTING FACTORS</h3>
        <ul className="space-y-3">
          {rootCause.contributingFactors.map((factor, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-sm flex items-center justify-center text-xs font-medium text-gray-600">
                {index + 1}
              </span>
              <p className="text-sm text-gray-700 flex-1">{factor}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-enterprise p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="text-corporate-navy" size={20} />
          <h3 className="text-sm font-semibold text-gray-900">SUPPORTING METRICS</h3>
        </div>
        <div className="space-y-4">
          {rootCause.supportingMetrics.map((metric, index) => (
            <div key={index} className="border-l-2 border-gray-300 pl-4">
              <p className="text-sm font-medium text-gray-900 mb-1">{metric.metric}</p>
              <div className="flex items-baseline space-x-3">
                <span className="text-lg font-semibold text-corporate-navy">{metric.value}</span>
                <span className="text-xs text-status-critical">{metric.deviation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
