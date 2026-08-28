import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { RootCauseView } from '../components/Analysis/RootCauseView';
import { alerts, rootCauses } from '../data/mockData';

interface AnalysisViewProps {
  selectedAlertId?: string;
  onNavigate: (view: string) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ selectedAlertId, onNavigate }) => {
  const alertId = selectedAlertId || alerts[0].id;
  const alert = alerts.find(a => a.id === alertId);
  const rootCause = rootCauses.find(rc => rc.alertId === alertId);

  if (!alert || !rootCause) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analysis available for this alert.</p>
      </div>
    );
  }

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
