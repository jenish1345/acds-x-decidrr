import React, { useState } from 'react';
import { CreditCard, Users, Calendar, TrendingUp, AlertCircle, Download } from 'lucide-react';
import type { Subscription, UsageMetrics, Invoice } from '../types/subscription';
import { pricingPlans } from '../data/pricingPlans';

// Mock data for demo
const mockSubscription: Subscription = {
  id: 'sub_1234567890',
  companyId: 'comp_001',
  planId: 'professional',
  tier: 'professional',
  status: 'active',
  billingInterval: 'annual',
  currentPeriodStart: '2026-01-01',
  currentPeriodEnd: '2027-01-01',
  cancelAtPeriodEnd: false,
  amount: 14990,
  currency: 'USD'
};

const mockUsage: UsageMetrics = {
  companyId: 'comp_001',
  period: '2026-01',
  alertsUsed: 234,
  alertsLimit: 500,
  usersActive: 7,
  usersLimit: 10,
  apiCallsUsed: 4521,
  apiCallsLimit: 10000,
  storageUsed: 1250
};

const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    companyId: 'comp_001',
    amount: 14990,
    currency: 'USD',
    status: 'paid',
    dueDate: '2026-01-01',
    paidAt: '2026-01-01',
    invoiceUrl: '#'
  },
  {
    id: 'inv_002',
    companyId: 'comp_001',
    amount: 14990,
    currency: 'USD',
    status: 'paid',
    dueDate: '2025-01-01',
    paidAt: '2025-01-01',
    invoiceUrl: '#'
  }
];

export const SubscriptionView: React.FC = () => {
  const [subscription] = useState<Subscription>(mockSubscription);
  const [usage] = useState<UsageMetrics>(mockUsage);
  const [invoices] = useState<Invoice[]>(mockInvoices);

  const currentPlan = pricingPlans.find(p => p.id === subscription.planId);
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'past_due': return 'bg-red-100 text-red-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Subscription & Billing</h1>
        <p className="text-sm text-gray-600">Manage your subscription, billing, and usage</p>
      </div>

      {/* Current Plan */}
      <div className="card-enterprise p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Plan</h2>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-semibold text-corporate-navy">
                {currentPlan?.name}
              </span>
              <span className={`status-badge ${getStatusColor(subscription.status)}`}>
                {subscription.status.toUpperCase()}
              </span>
            </div>
          </div>
          <button className="btn-secondary">
            Change Plan
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">BILLING AMOUNT</p>
            <p className="text-xl font-semibold text-gray-900">
              ${subscription.amount.toLocaleString()}
              <span className="text-sm text-gray-600 font-normal">
                /{subscription.billingInterval === 'annual' ? 'year' : 'month'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">CURRENT PERIOD</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(subscription.currentPeriodStart)}
            </p>
            <p className="text-xs text-gray-600">
              to {formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">NEXT BILLING DATE</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(subscription.currentPeriodEnd)}
            </p>
            <p className="text-xs text-gray-600">
              Auto-renewal enabled
            </p>
          </div>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 flex items-start space-x-3">
            <AlertCircle className="text-status-warning mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Subscription will be canceled
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Your subscription will end on {formatDate(subscription.currentPeriodEnd)}.
                You can reactivate anytime before this date.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Usage Metrics */}
      <div className="card-enterprise p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Usage This Month</h2>
        
        <div className="space-y-6">
          {/* Alerts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Alerts</span>
              </div>
              <span className="text-sm text-gray-600">
                {usage.alertsUsed.toLocaleString()} / {usage.alertsLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-sm h-2">
              <div
                className="bg-corporate-navy h-2 rounded-sm transition-all"
                style={{ width: `${calculateUsagePercentage(usage.alertsUsed, usage.alertsLimit)}%` }}
              />
            </div>
          </div>

          {/* Users */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Active Users</span>
              </div>
              <span className="text-sm text-gray-600">
                {usage.usersActive} / {usage.usersLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-sm h-2">
              <div
                className="bg-corporate-navy h-2 rounded-sm transition-all"
                style={{ width: `${calculateUsagePercentage(usage.usersActive, usage.usersLimit)}%` }}
              />
            </div>
          </div>

          {/* API Calls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-900">API Calls</span>
              </div>
              <span className="text-sm text-gray-600">
                {usage.apiCallsUsed.toLocaleString()} / {usage.apiCallsLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-sm h-2">
              <div
                className="bg-corporate-navy h-2 rounded-sm transition-all"
                style={{ width: `${calculateUsagePercentage(usage.apiCallsUsed, usage.apiCallsLimit)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Usage resets on {formatDate(subscription.currentPeriodEnd)}
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card-enterprise p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          <button className="btn-secondary text-sm">
            Update
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
            <CreditCard size={20} className="text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
            <p className="text-xs text-gray-600">Expires 12/2027</p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="card-enterprise p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h2>
        
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div className="flex items-center space-x-4">
                <Calendar size={16} className="text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(invoice.dueDate)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Invoice #{invoice.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs ${
                    invoice.status === 'paid' ? 'text-status-healthy' : 'text-status-critical'
                  }`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Subscription */}
      <div className="card-enterprise p-6 border-red-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Cancel Subscription</h2>
        <p className="text-sm text-gray-600 mb-4">
          If you cancel, you'll continue to have access until {formatDate(subscription.currentPeriodEnd)}.
          You can reactivate your subscription anytime before this date.
        </p>
        <button className="px-4 py-2 text-sm text-red-700 border border-red-300 rounded-sm hover:bg-red-50 transition-colors">
          Cancel Subscription
        </button>
      </div>
    </div>
  );
};
