import React from 'react';
import { DepartmentHeatmap } from '../components/Heatmap/DepartmentHeatmap';
import { useDatasetStore } from '../store/datasetStore';
import { NoDatasetEmptyState } from '../components/Common/NoDatasetEmptyState';
import type { DepartmentRisk } from '../types';

interface HeatmapViewProps {
  onNavigate?: (view: string) => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ onNavigate }) => {
  const currentDataset = useDatasetStore((state) => state.currentDataset);
  const alerts = useDatasetStore((state) => state.dynamicAlerts) || [];

  if (!currentDataset) {
    return (
      <NoDatasetEmptyState
        title="Department Risk Heatmap"
        description="Upload an organizational or operational dataset to map department-level risk exposure, active alerts, and vulnerability scores."
        onNavigate={onNavigate}
      />
    );
  }

  const datasetDepartments = currentDataset.mappings?.department
    ? Array.from(new Set(currentDataset.data.map(r => String(r[currentDataset.mappings!.department!])).filter(Boolean)))
    : [];

  const allDepts = Array.from(new Set([
    ...alerts.map(a => a.department),
    ...(datasetDepartments.length > 0 ? datasetDepartments : ['Operations', 'Finance', 'Technology', 'Sales', 'Customer Success'])
  ]));

  const departmentRisks: DepartmentRisk[] = allDepts.map(dept => {
    const deptAlerts = alerts.filter(a => a.department.toLowerCase() === dept.toLowerCase());
    const critical = deptAlerts.some(a => a.severity === 'critical');
    const warning = deptAlerts.some(a => a.severity === 'warning');
    const riskLevel = critical ? 'critical' : warning ? 'warning' : 'healthy';
    const score = critical ? 80 : warning ? 62 : 30;

    return {
      department: dept,
      riskLevel,
      score,
      activeAlerts: deptAlerts.length
    };
  });
  const criticalCount = departmentRisks.filter(d => d.riskLevel === 'critical').length;
  const warningCount = departmentRisks.filter(d => d.riskLevel === 'warning').length;
  const healthyCount = departmentRisks.filter(d => d.riskLevel === 'healthy').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Department Risk Heatmap</h1>
        <p className="text-sm text-gray-600">Cross-functional risk visibility and monitoring</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card-enterprise p-5">
          <p className="text-xs text-gray-500 mb-2">TOTAL DEPARTMENTS</p>
          <p className="text-3xl font-semibold text-gray-900">{departmentRisks.length}</p>
        </div>
        <div className="card-enterprise p-5">
          <p className="text-xs text-gray-500 mb-2">CRITICAL RISK</p>
          <p className="text-3xl font-semibold text-status-critical">{criticalCount}</p>
        </div>
        <div className="card-enterprise p-5">
          <p className="text-xs text-gray-500 mb-2">WARNING</p>
          <p className="text-3xl font-semibold text-status-warning">{warningCount}</p>
        </div>
        <div className="card-enterprise p-5">
          <p className="text-xs text-gray-500 mb-2">HEALTHY</p>
          <p className="text-3xl font-semibold text-status-healthy">{healthyCount}</p>
        </div>
      </div>

      <DepartmentHeatmap departments={departmentRisks} />

      <div className="card-enterprise p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">RISK DISTRIBUTION ANALYSIS</h3>
        <div className="space-y-4">
          {departmentRisks
            .sort((a, b) => b.score - a.score)
            .map((dept) => (
              <div key={dept.department} className="flex items-center space-x-4">
                <div className="w-40 text-sm font-medium text-gray-900">{dept.department}</div>
                <div className="flex-1 bg-gray-200 rounded-sm h-8 relative overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      dept.riskLevel === 'critical'
                        ? 'bg-status-critical'
                        : dept.riskLevel === 'warning'
                        ? 'bg-status-warning'
                        : 'bg-status-healthy'
                    }`}
                    style={{ width: `${dept.score}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {dept.score} / 100
                  </span>
                </div>
                <div className="w-24 text-sm text-gray-600 text-right">
                  {dept.activeAlerts} alert{dept.activeAlerts !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
