import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { pricingPlans, calculateAnnualSavings } from '../data/pricingPlans';
import type { BillingInterval } from '../types/subscription';

interface PricingViewProps {
  onSelectPlan: (planId: string, interval: BillingInterval) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan }) => {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('annual');

  const formatPrice = (price: number) => {
    if (price === 0) return 'Contact Sales';
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Select the perfect plan for your organization
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-sm p-1">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`px-6 py-2 rounded-sm text-sm font-medium transition-colors ${
              billingInterval === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('annual')}
            className={`px-6 py-2 rounded-sm text-sm font-medium transition-colors ${
              billingInterval === 'annual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annual
            <span className="ml-2 text-xs text-status-healthy">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {pricingPlans.map((plan) => {
          const price = billingInterval === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const displayPrice = billingInterval === 'annual' ? price / 12 : price;
          const savings = calculateAnnualSavings(plan);

          return (
            <div
              key={plan.id}
              className={`card-enterprise p-6 relative ${
                plan.popular
                  ? 'ring-2 ring-corporate-navy shadow-lg'
                  : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 bg-corporate-navy text-white px-3 py-1 rounded-sm text-xs font-medium">
                    <Zap size={12} />
                    <span>MOST POPULAR</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 h-10">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-2">
                  {price === 0 ? (
                    <p className="text-2xl font-semibold text-gray-900">
                      Custom Pricing
                    </p>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-semibold text-gray-900">
                          {formatPrice(Math.round(displayPrice))}
                        </span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </div>
                      {billingInterval === 'annual' && savings > 0 && (
                        <p className="text-xs text-status-healthy mt-1">
                          Save ${savings.toLocaleString()}/year
                        </p>
                      )}
                    </>
                  )}
                </div>

                {billingInterval === 'annual' && price > 0 && (
                  <p className="text-xs text-gray-500">
                    Billed annually: {formatPrice(price)}
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => onSelectPlan(plan.id, billingInterval)}
                className={`w-full py-3 rounded-sm text-sm font-medium transition-colors mb-6 ${
                  plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {price === 0 ? 'Contact Sales' : 'Start Free Trial'}
              </button>

              {/* Features */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-900 uppercase">
                  Features
                </p>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check size={16} className="text-status-healthy mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Limits */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-900 uppercase mb-3">
                  Limits
                </p>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Users:</span>
                    <span className="font-medium text-gray-900">
                      {plan.limits.users === 999999 ? 'Unlimited' : plan.limits.users}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departments:</span>
                    <span className="font-medium text-gray-900">
                      {plan.limits.departments === 999999 ? 'Unlimited' : plan.limits.departments}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alerts/month:</span>
                    <span className="font-medium text-gray-900">
                      {plan.limits.alerts === 999999 ? 'Unlimited' : plan.limits.alerts}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data retention:</span>
                    <span className="font-medium text-gray-900">
                      {plan.limits.dataRetention === 999999 
                        ? 'Unlimited' 
                        : `${plan.limits.dataRetention} days`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ / Additional Info */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="card-enterprise p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Plans Include
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Check size={16} className="text-status-healthy mt-0.5" />
              <span className="text-sm text-gray-700">14-day free trial</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check size={16} className="text-status-healthy mt-0.5" />
              <span className="text-sm text-gray-700">No credit card required</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check size={16} className="text-status-healthy mt-0.5" />
              <span className="text-sm text-gray-700">Cancel anytime</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check size={16} className="text-status-healthy mt-0.5" />
              <span className="text-sm text-gray-700">Secure payment processing</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check size={16} className="text-status-healthy mt-0.5" />
              <span className="text-sm text-gray-700">SOC 2 Type II certified</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check size={16} className="text-status-healthy mt-0.5" />
              <span className="text-sm text-gray-700">GDPR compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="max-w-4xl mx-auto">
        <div className="card-enterprise p-8 bg-corporate-navy text-white">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-3">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-200 mb-6">
              For Fortune 500 companies and organizations with unique requirements,
              we offer fully customized solutions with dedicated support.
            </p>
            <button className="bg-white text-corporate-navy px-6 py-3 rounded-sm font-medium hover:bg-gray-100 transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
