import React from 'react';
import { Download, Printer } from 'lucide-react';
import { companyHealth, kpis, alerts, businessImpacts, recommendations, departmentRisks } from '../data/mockData';

export const ReportView: React.FC = () => {
  const totalImpact = businessImpacts.reduce((sum, bi) => sum + bi.financialImpact.estimated, 0);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Executive Summary Report</h1>
          <p className="text-sm text-gray-600">Comprehensive company diagnostic overview</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Printer size={16} />
            <span>Print</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Download size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="card-enterprise p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Company Health Diagnostic Report
              </h2>
              <p className="text-sm text-gray-600">
                Generated: {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Overall Health Score</p>
              <p className={`text-4xl font-semibold ${
                companyHealth.riskStatus === 'critical' ? 'text-status-critical' :
                companyHealth.riskStatus === 'warning' ? 'text-status-warning' :
                'text-status-healthy'
              }`}>
                {companyHealth.overallScore}/100
              </p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">EXECUTIVE SUMMARY</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 space-y-3 text-sm leading-relaxed">
            <p className="text-gray-800">
              The Autonomous Company Diagnostic System has identified <strong>{alerts.length} active risk alerts</strong> across 
              the organization, with <strong>{criticalAlerts} classified as critical</strong>. The overall company health score 
              stands at <strong>{companyHealth.overallScore}/100</strong>, indicating a <strong>{companyHealth.riskStatus}</strong> status 
              with a <strong>{companyHealth.trend === 'down' ? 'declining' : companyHealth.trend === 'up' ? 'improving' : 'stable'}</strong> trend.
            </p>
            <p className="text-gray-800">
              Total estimated financial impact from identified risks: <strong className="text-status-critical">
                ${(totalImpact / 1000000).toFixed(1)}M
              </strong>. Immediate executive attention is required for supply chain disruptions and customer retention challenges.
            </p>
            <p className="text-gray-800">
              <strong>{recommendations.filter(r => r.priority === 'critical').length} critical recommendations</strong> have 
              been generated with clear ownership assignments and implementation timelines ranging from 30 to 90 days.
            </p>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">KEY PERFORMANCE INDICATORS</h3>
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.id} className="border border-gray-200 rounded-sm p-4">
                <p className="text-xs text-gray-600 mb-2">{kpi.label}</p>
                <p className="text-xl font-semibold text-gray-900 mb-1">{kpi.value}</p>
                <p className={`text-xs ${kpi.trend === 'up' ? 'text-status-healthy' : 'text-status-critical'}`}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}% vs prior period
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Risks */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">CRITICAL RISK ALERTS</h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={alert.id} className="border-l-4 border-gray-300 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {index + 1}. {alert.title}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{alert.department}</span>
                      <span>•</span>
                      <span>{alert.impact.toUpperCase()} Impact</span>
                      <span>•</span>
                      <span>Detected: {new Date(alert.detectedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-sm ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Risk Overview */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">DEPARTMENT RISK OVERVIEW</h3>
          <div className="grid grid-cols-3 gap-3">
            {departmentRisks.map((dept) => (
              <div key={dept.department} className={`border-2 rounded-sm p-4 ${
                dept.riskLevel === 'critical' ? 'border-red-200 bg-red-50' :
                dept.riskLevel === 'warning' ? 'border-amber-200 bg-amber-50' :
                'border-green-200 bg-green-50'
              }`}>
                <p className="text-xs font-medium text-gray-900 mb-2">{dept.department}</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-semibold text-gray-900">{dept.score}</span>
                  <span className="text-xs text-gray-600">/ 100</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{dept.activeAlerts} active alerts</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Summary */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">STRATEGIC RECOMMENDATIONS</h3>
          <div className="space-y-3">
            {recommendations.slice(0, 4).map((rec, index) => (
              <div key={rec.id} className="border border-gray-200 rounded-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900 flex-1">
                    {index + 1}. {rec.title}
                  </p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-sm ml-3 ${
                    rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Owner: {rec.owner}</span>
                  <span>•</span>
                  <span>Timeline: {rec.timeline}</span>
                  <span>•</span>
                  <span>Effort: {rec.effort.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-xs text-gray-500">
          <p>This report is confidential and intended for executive leadership only.</p>
          <p className="mt-1">© 2026 ACDS - Autonomous Company Diagnostic System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
