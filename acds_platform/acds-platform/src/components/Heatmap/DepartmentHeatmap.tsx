import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { DepartmentRisk } from '../../types';

interface DepartmentHeatmapProps {
  departments: DepartmentRisk[];
}

export const DepartmentHeatmap: React.FC<DepartmentHeatmapProps> = ({ departments }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-900';
      case 'warning':
        return 'bg-amber-100 border-amber-300 text-amber-900';
      default:
        return 'bg-green-100 border-green-300 text-green-900';
    }
  };

  const getRiskIntensity = (score: number) => {
    if (score >= 75) return 'bg-red-200';
    if (score >= 60) return 'bg-amber-200';
    if (score >= 40) return 'bg-amber-100';
    return 'bg-green-100';
  };

  return (
    <div className="card-enterprise p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Department Risk Overview</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {departments.map((dept) => (
          <div
            key={dept.department}
            className={`border-2 rounded-sm p-5 transition-all hover:shadow-md ${getRiskColor(dept.riskLevel)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold">{dept.department}</h3>
              {dept.activeAlerts > 0 && (
                <div className="flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span className="text-xs font-medium">{dept.activeAlerts}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold">{dept.score}</span>
                <span className="text-xs opacity-70">Risk Score</span>
              </div>
              
              <div className="w-full bg-white bg-opacity-50 rounded-sm h-1.5">
                <div
                  className={`h-1.5 rounded-sm ${getRiskIntensity(dept.score)}`}
                  style={{ width: `${dept.score}%` }}
                />
              </div>
              
              <p className="text-xs font-medium uppercase opacity-80">{dept.riskLevel}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end space-x-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm" />
          <span className="text-xs text-gray-600">Healthy (0-50)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded-sm" />
          <span className="text-xs text-gray-600">Warning (51-70)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded-sm" />
          <span className="text-xs text-gray-600">Critical (71-100)</span>
        </div>
      </div>
    </div>
  );
};
