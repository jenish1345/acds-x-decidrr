import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { AlertCard } from '../components/Alerts/AlertCard';
import { alerts } from '../data/mockData';
import type { RiskLevel } from '../types';

interface AlertsViewProps {
  onNavigate: (view: string, alertId?: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onNavigate }) => {
  const [filterSeverity, setFilterSeverity] = useState<RiskLevel | 'all'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const departments = Array.from(new Set(alerts.map(a => a.department)));

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterDepartment !== 'all' && alert.department !== filterDepartment) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Risk & Diagnostic Alerts</h1>
        <p className="text-sm text-gray-600">Monitor and manage company-wide risk indicators</p>
      </div>

      <div className="card-enterprise p-4">
        <div className="flex items-center space-x-4">
          <Filter size={18} className="text-gray-500" />
          <div className="flex items-center space-x-4 flex-1">
            <div>
              <label className="text-xs text-gray-600 mr-2">Severity:</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as RiskLevel | 'all')}
                className="text-sm border border-gray-300 rounded-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-corporate-navy"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="healthy">Healthy</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mr-2">Department:</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="text-sm border border-gray-300 rounded-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-corporate-navy"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onViewDetails={(id) => onNavigate('analysis', id)}
          />
        ))}
      </div>
    </div>
  );
};
