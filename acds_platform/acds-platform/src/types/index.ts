export type RiskLevel = 'critical' | 'warning' | 'healthy';
export type UserRole = 'executive' | 'manager' | 'analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface CompanyHealth {
  overallScore: number;
  riskStatus: RiskLevel;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

export interface KPI {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Alert {
  id: string;
  title: string;
  severity: RiskLevel;
  department: string;
  impact: 'high' | 'medium' | 'low';
  detectedDate: string;
  description: string;
  affectedMetrics: string[];
}

export interface RootCause {
  id: string;
  alertId: string;
  primaryCause: string;
  contributingFactors: string[];
  supportingMetrics: Array<{
    metric: string;
    value: string;
    deviation: string;
  }>;
  confidence: number;
}

export interface BusinessImpact {
  id: string;
  alertId: string;
  financialImpact: {
    estimated: number;
    range: { min: number; max: number };
    currency: string;
  };
  probability: number;
  timeframe: string;
  affectedRevenue: number;
}

export interface Recommendation {
  id: string;
  alertId: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  expectedOutcome: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  owner: string;
}

export interface DepartmentRisk {
  department: string;
  riskLevel: RiskLevel;
  score: number;
  activeAlerts: number;
}

export interface PredictiveInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}
