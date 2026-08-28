import React from 'react';
import { ImpactCard } from '../components/Impact/ImpactCard';
import { businessImpacts, alerts } from '../data/mockData';

interface ImpactViewProps {
  onNavigate: (view: string) => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Business Impact Estimation</h1>
        <p className="text-sm text-gray-600">Financial and operational impact analysis of identified risks</p>
      </div>

      <div className="space-y-6">
        {businessImpacts.map((impact) => {
          const alert = alerts.find(a => a.id === impact.alertId);
          return (
            <div key={impact.id}>
              <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-900">{alert?.title}</h3>
                <p className="text-sm text-gray-600">{alert?.department}</p>
              </div>
              <ImpactCard impact={impact} />
            </div>
          );
        })}
      </div>

      <div className="card-enterprise p-6 bg-blue-50 border-blue-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">EXECUTIVE SUMMARY</h3>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Estimated Impact</p>
            <p className="text-2xl font-semibold text-status-critical">
              ${(businessImpacts.reduce((sum, bi) => sum + bi.financialImpact.estimated, 0) / 1000000).toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Affected Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${(businessImpacts.reduce((sum, bi) => sum + bi.affectedRevenue, 0) / 1000000).toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Average Probability</p>
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(businessImpacts.reduce((sum, bi) => sum + bi.probability, 0) / businessImpacts.length)}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onNavigate('recommendations')}
          className="btn-primary"
        >
          View Mitigation Recommendations
        </button>
      </div>
    </div>
  );
};
