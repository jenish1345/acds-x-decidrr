import React from 'react';
import { ImpactCard } from '../components/Impact/ImpactCard';
import { useDatasetStore } from '../store/datasetStore';
import { NoDatasetEmptyState } from '../components/Common/NoDatasetEmptyState';
import type { BusinessImpact } from '../types';

interface ImpactViewProps {
  onNavigate: (view: string) => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ onNavigate }) => {
  const currentDataset = useDatasetStore((state) => state.currentDataset);
  const alerts = useDatasetStore((state) => state.dynamicAlerts) || [];
  const predictedLoss = useDatasetStore((state) => state.predictedLoss) || 0;

  if (!currentDataset) {
    return (
      <NoDatasetEmptyState
        title="Business Impact Estimation"
        description="Upload your operational or financial dataset to estimate risk exposure, revenue at risk, and projected losses."
        onNavigate={onNavigate}
      />
    );
  }

  const businessImpacts: BusinessImpact[] = alerts.map((alert) => {
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length || 1;
    const warningAlerts = alerts.filter(a => a.severity !== 'critical').length || 1;
    const factor = alert.severity === 'critical' ? (0.65 / criticalAlerts) : (0.35 / warningAlerts);
    const estimated = Math.max(50000, Math.round(predictedLoss * factor));

    return {
      id: `BI_${alert.id}`,
      alertId: alert.id,
      financialImpact: {
        estimated,
        range: { min: Math.round(estimated * 0.75), max: Math.round(estimated * 1.35) },
        currency: 'USD'
      },
      probability: alert.severity === 'critical' ? 82 : 60,
      timeframe: 'Next 90 days',
      affectedRevenue: Math.round(estimated * 2.8)
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Business Impact Estimation</h1>
        <p className="text-sm text-gray-600">Financial and operational impact analysis of identified risks</p>
      </div>

      <div className="space-y-6">
        {businessImpacts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500 text-sm">
            No high-impact risks identified for the current dataset. All operational indicators appear within safe thresholds.
          </div>
        ) : (
          businessImpacts.map((impact) => {
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
          })
        )}
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
              {businessImpacts.length > 0
                ? `${Math.round(businessImpacts.reduce((sum, bi) => sum + bi.probability, 0) / businessImpacts.length)}%`
                : '0%'}
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
