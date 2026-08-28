import type { PricingPlan } from '../types/subscription';

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    tier: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses getting started with diagnostics',
    monthlyPrice: 499,
    annualPrice: 4990, // ~17% discount
    features: [
      '1 company profile',
      '3 user seats',
      'Basic health monitoring',
      '5 departments tracked',
      'Email alerts',
      'Monthly reports',
      'Standard support',
      '30-day data retention'
    ],
    limits: {
      users: 3,
      departments: 5,
      alerts: 100,
      dataRetention: 30,
      apiCalls: 1000
    }
  },
  {
    id: 'professional',
    tier: 'professional',
    name: 'Professional',
    description: 'Advanced features for growing mid-market companies',
    monthlyPrice: 1499,
    annualPrice: 14990, // ~17% discount
    popular: true,
    features: [
      'Everything in Starter',
      '10 user seats',
      'Advanced AI analysis',
      'Unlimited departments',
      'Real-time alerts',
      'Weekly reports',
      'Root cause analysis',
      'Business impact predictions',
      'Priority support',
      'API access',
      '1-year data retention',
      'Custom dashboards'
    ],
    limits: {
      users: 10,
      departments: 999,
      alerts: 500,
      dataRetention: 365,
      apiCalls: 10000
    }
  },
  {
    id: 'enterprise',
    tier: 'enterprise',
    name: 'Enterprise',
    description: 'Complete solution for large organizations',
    monthlyPrice: 4999,
    annualPrice: 49990, // ~17% discount
    features: [
      'Everything in Professional',
      'Unlimited user seats',
      'Multi-company support',
      'Custom AI models',
      'Dedicated account manager',
      '24/7 premium support',
      'On-premise deployment option',
      'White-label capabilities',
      'SLA guarantees',
      'Custom integrations',
      'Unlimited data retention',
      'Predictive analytics',
      'Custom workflows'
    ],
    limits: {
      users: 999999,
      departments: 999999,
      alerts: 999999,
      dataRetention: 999999,
      apiCalls: 999999
    }
  },
  {
    id: 'custom',
    tier: 'custom',
    name: 'Custom',
    description: 'Tailored solutions for Fortune 500 companies',
    monthlyPrice: 0, // Contact sales
    annualPrice: 0,
    features: [
      'Everything in Enterprise',
      'Dedicated infrastructure',
      'Custom development',
      'Multi-region deployment',
      'Compliance certifications',
      'Executive consulting',
      'Strategic partnership',
      'Volume discounts',
      'Custom SLAs'
    ],
    limits: {
      users: 999999,
      departments: 999999,
      alerts: 999999,
      dataRetention: 999999,
      apiCalls: 999999
    }
  }
];

export function getPlanByTier(tier: string): PricingPlan | undefined {
  return pricingPlans.find(plan => plan.tier === tier);
}

export function calculateAnnualSavings(plan: PricingPlan): number {
  const monthlyTotal = plan.monthlyPrice * 12;
  return monthlyTotal - plan.annualPrice;
}

export function calculateSavingsPercentage(plan: PricingPlan): number {
  const monthlyTotal = plan.monthlyPrice * 12;
  return Math.round(((monthlyTotal - plan.annualPrice) / monthlyTotal) * 100);
}
