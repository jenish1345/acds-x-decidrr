// Subscription & Billing Types for B2B SaaS

export type PlanTier = 'starter' | 'professional' | 'enterprise' | 'custom';
export type BillingInterval = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';

export interface PricingPlan {
  id: string;
  tier: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limits: {
    users: number;
    departments: number;
    alerts: number;
    dataRetention: number; // days
    apiCalls: number;
  };
  popular?: boolean;
}

export interface Subscription {
  id: string;
  companyId: string;
  planId: string;
  tier: PlanTier;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  createdAt: string;
  subscription: Subscription;
  users: CompanyUser[];
}

export interface CompanyUser {
  id: string;
  companyId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'suspended';
  lastLogin?: string;
}

export interface Invoice {
  id: string;
  companyId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  dueDate: string;
  paidAt?: string;
  invoiceUrl: string;
}

export interface UsageMetrics {
  companyId: string;
  period: string;
  alertsUsed: number;
  alertsLimit: number;
  usersActive: number;
  usersLimit: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  storageUsed: number; // MB
}
