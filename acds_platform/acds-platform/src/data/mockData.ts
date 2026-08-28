import type { CompanyHealth, KPI, Alert, RootCause, BusinessImpact, Recommendation, DepartmentRisk, User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Robert Chen',
  email: 'r.chen@company.com',
  role: 'executive',
  department: 'Executive Office'
};

export const companyHealth: CompanyHealth = {
  overallScore: 72,
  riskStatus: 'warning',
  lastUpdated: '2026-01-20T09:30:00Z',
  trend: 'down'
};

export const kpis: KPI[] = [
  { id: '1', label: 'Revenue Growth', value: '+8.2%', change: -2.1, trend: 'down' },
  { id: '2', label: 'Operating Margin', value: '24.5%', change: -3.2, trend: 'down' },
  { id: '3', label: 'Customer Retention', value: '89.3%', change: 1.5, trend: 'up' },
  { id: '4', label: 'Employee Satisfaction', value: '7.8/10', change: -0.4, trend: 'down' }
];

export const alerts: Alert[] = [
  {
    id: 'A001',
    title: 'Supply Chain Disruption Detected',
    severity: 'critical',
    department: 'Operations',
    impact: 'high',
    detectedDate: '2026-01-18',
    description: 'Significant delays in raw material procurement affecting production schedules',
    affectedMetrics: ['Production Output', 'Delivery Time', 'Inventory Levels']
  },
  {
    id: 'A002',
    title: 'Customer Churn Rate Increasing',
    severity: 'warning',
    department: 'Sales',
    impact: 'high',
    detectedDate: '2026-01-17',
    description: 'Enterprise customer churn rate increased by 15% in Q4',
    affectedMetrics: ['Customer Retention', 'Revenue', 'Contract Renewals']
  },
  {
    id: 'A003',
    title: 'IT Infrastructure Performance Degradation',
    severity: 'warning',
    department: 'Technology',
    impact: 'medium',
    detectedDate: '2026-01-19',
    description: 'System response times increased by 40% during peak hours',
    affectedMetrics: ['System Uptime', 'Response Time', 'User Satisfaction']
  }
];

export const rootCauses: RootCause[] = [
  {
    id: 'RC001',
    alertId: 'A001',
    primaryCause: 'Primary supplier experienced production facility shutdown due to regulatory compliance issues',
    contributingFactors: [
      'Lack of supplier diversification strategy',
      'Insufficient inventory buffer for critical components',
      'Delayed communication from supplier management team'
    ],
    supportingMetrics: [
      { metric: 'Supplier Dependency Ratio', value: '68%', deviation: '+23% above threshold' },
      { metric: 'Inventory Days on Hand', value: '12 days', deviation: '-18 days below target' },
      { metric: 'Supplier Communication Lag', value: '4.2 days', deviation: '+2.8 days above SLA' }
    ],
    confidence: 87
  },
  {
    id: 'RC002',
    alertId: 'A002',
    primaryCause: 'Competitor launched aggressive pricing strategy with enhanced service offerings',
    contributingFactors: [
      'Product feature gap identified in customer feedback',
      'Customer support response time increased by 35%',
      'Pricing model not competitive for mid-tier enterprise segment'
    ],
    supportingMetrics: [
      { metric: 'Competitive Price Index', value: '112', deviation: '+12% above market' },
      { metric: 'Feature Parity Score', value: '78%', deviation: '-15% vs competitor' },
      { metric: 'Support Response Time', value: '8.2 hours', deviation: '+3.1 hours above SLA' }
    ],
    confidence: 82
  }
];

export const businessImpacts: BusinessImpact[] = [
  {
    id: 'BI001',
    alertId: 'A001',
    financialImpact: {
      estimated: 4200000,
      range: { min: 3100000, max: 5800000 },
      currency: 'USD'
    },
    probability: 78,
    timeframe: 'Q1 2026',
    affectedRevenue: 12500000
  },
  {
    id: 'BI002',
    alertId: 'A002',
    financialImpact: {
      estimated: 6800000,
      range: { min: 5200000, max: 9100000 },
      currency: 'USD'
    },
    probability: 85,
    timeframe: 'Next 6 months',
    affectedRevenue: 18300000
  }
];

export const recommendations: Recommendation[] = [
  {
    id: 'R001',
    alertId: 'A001',
    title: 'Implement Multi-Supplier Sourcing Strategy',
    description: 'Diversify supplier base by onboarding 2-3 qualified alternative suppliers for critical components. Establish strategic partnerships with backup suppliers in different geographic regions.',
    priority: 'critical',
    expectedOutcome: 'Reduce supplier dependency from 68% to <40%, increase supply chain resilience by 60%',
    effort: 'high',
    timeline: '90 days',
    owner: 'Chief Operations Officer'
  },
  {
    id: 'R002',
    alertId: 'A001',
    title: 'Increase Strategic Inventory Buffer',
    description: 'Increase inventory levels for critical components from 12 to 30 days. Implement predictive inventory management system.',
    priority: 'high',
    expectedOutcome: 'Mitigate production disruption risk by 45%, improve delivery reliability to 98%',
    effort: 'medium',
    timeline: '45 days',
    owner: 'VP Supply Chain'
  },
  {
    id: 'R003',
    alertId: 'A002',
    title: 'Launch Customer Retention Initiative',
    description: 'Deploy dedicated account management team for at-risk enterprise customers. Implement quarterly business review process and customized success plans.',
    priority: 'critical',
    expectedOutcome: 'Reduce churn rate by 40%, increase customer lifetime value by $2.1M',
    effort: 'medium',
    timeline: '60 days',
    owner: 'Chief Revenue Officer'
  },
  {
    id: 'R004',
    alertId: 'A002',
    title: 'Competitive Pricing Analysis & Adjustment',
    description: 'Conduct comprehensive market pricing analysis and adjust pricing model for mid-tier segment. Introduce flexible pricing tiers with enhanced value propositions.',
    priority: 'high',
    expectedOutcome: 'Improve price competitiveness by 15%, increase win rate by 25%',
    effort: 'low',
    timeline: '30 days',
    owner: 'Chief Commercial Officer'
  }
];

export const departmentRisks: DepartmentRisk[] = [
  { department: 'Operations', riskLevel: 'critical', score: 82, activeAlerts: 3 },
  { department: 'Sales', riskLevel: 'warning', score: 68, activeAlerts: 2 },
  { department: 'Technology', riskLevel: 'warning', score: 64, activeAlerts: 2 },
  { department: 'Finance', riskLevel: 'healthy', score: 42, activeAlerts: 1 },
  { department: 'Human Resources', riskLevel: 'warning', score: 58, activeAlerts: 1 },
  { department: 'Marketing', riskLevel: 'healthy', score: 38, activeAlerts: 0 }
];
