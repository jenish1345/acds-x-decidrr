import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import type { Alert } from '../../types';

interface AlertCardProps {
  alert: Alert;
  onViewDetails: (alertId: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onViewDetails }) => {
  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const getImpactStyles = () => {
    switch (alert.impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="card-enterprise p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <AlertCircle className={alert.severity === 'critical' ? 'text-status-critical' : 'text-status-warning'} size={20} />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{alert.title}</h3>
            <p className="text-xs text-gray-600">{alert.description}</p>
          </div>
        </div>
        <span className={`status-badge ${getSeverityStyles()}`}>
          {alert.severity.toUpperCase()}
        </span>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <span className="font-medium">{alert.department}</span>
          <span className={`status-badge ${getImpactStyles()}`}>
            {alert.impact.toUpperCase()} IMPACT
          </span>
          <span>{new Date(alert.detectedDate).toLocaleDateString()}</span>
        </div>
        
        <button
          onClick={() => onViewDetails(alert.id)}
          className="flex items-center space-x-1 text-xs text-corporate-navy hover:text-corporate-darkblue font-medium"
        >
          <span>View Details</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
