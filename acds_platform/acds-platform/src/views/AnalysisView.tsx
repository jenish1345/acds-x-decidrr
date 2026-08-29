import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { RootCauseView } from '../components/Analysis/RootCauseView';
import { useDatasetStore } from '../store/datasetStore';
import { NoDatasetEmptyState } from '../components/Common/NoDatasetEmptyState';
import type { RootCause } from '../types';

interface AnalysisViewProps {
  selectedAlertId?: string;
  onNavigate: (view: string) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ selectedAlertId, onNavigate }) => {
  const currentDataset = useDatasetStore((state) => state.currentDataset);
  const alerts = useDatasetStore((state) => state.dynamicAlerts) || [];

  if (!currentDataset) {
    return (
      <NoDatasetEmptyState
        title="Root Cause Analysis"
        description="Upload an operational dataset to perform diagnostic root cause tracing and correlation analysis on detected anomalies."
        onNavigate={onNavigate}
      />
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-base font-semibold text-gray-800">No alerts detected in current dataset</p>
        <p className="text-sm text-gray-500 mt-1">All metrics in this dataset appear within healthy baseline parameters.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="mt-4 px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const alertId = selectedAlertId || alerts[0]?.id;
  const alert = alerts.find(a => a.id === alertId) || alerts[0];

  const rootCause: RootCause = {
    id: `RC_${alert.id}`,
    alertId: alert.id,
    primaryCause: alert.description,
    contributingFactors: alert.affectedMetrics && alert.affectedMetrics.length > 0
      ? alert.affectedMetrics.map(m => `Observed irregular variation in ${m}`)
      : ['Operational deviation exceeding standard threshold', 'Data point variance outside baseline parameters'],
    supportingMetrics: alert.affectedMetrics && alert.affectedMetrics.length > 0
      ? alert.affectedMetrics.map(m => ({
          metric: m,
          value: 'Anomaly flagged',
          deviation: 'Outside baseline distribution'
        }))
      : [{ metric: 'Overall Health Deviation', value: 'High', deviation: '+2.4σ' }],
    confidence: alert.severity === 'critical' ? 88 : 78
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => onNavigate('alerts')}
          className="flex items-center space-x-2 text-sm text-corporate-navy hover:text-corporate-darkblue mb-4"
        >
          <ArrowLeft size={16} />
          <span>Back to Alerts</span>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Root Cause Analysis</h1>
        <p className="text-sm text-gray-600">{alert.title}</p>
      </div>

      <div className="card-enterprise p-5 bg-gray-50">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">ALERT ID</p>
            <p className="font-medium text-gray-900">{alert.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">DEPARTMENT</p>
            <p className="font-medium text-gray-900">{alert.department}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">SEVERITY</p>
            <p className="font-medium text-gray-900 uppercase">{alert.severity}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">DETECTED</p>
            <p className="font-medium text-gray-900">{new Date(alert.detectedDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <RootCauseView rootCause={rootCause} />

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => onNavigate('impact')}
          className="btn-secondary"
        >
          View Business Impact
        </button>
        <button
          onClick={() => onNavigate('recommendations')}
          className="btn-primary"
        >
          View Recommendations
        </button>
      </div>
    </div>
  );
};
