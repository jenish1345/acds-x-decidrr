/**
 * Stripe Payment Service
 * Handles subscription management and payment processing
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import type { PricingPlan, BillingInterval } from '../types/subscription';

// Initialize Stripe (use your publishable key)
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    // @ts-ignore - Vite env types
    const key = (import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY as string) || 'pk_test_your_key_here';
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  plan: PricingPlan,
  billingInterval: BillingInterval,
  companyEmail: string
): Promise<{ sessionId: string; url: string }> {
  // In production, this would call your backend API
  // Backend would create Stripe checkout session and return session ID
  
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: plan.id,
      billingInterval,
      email: companyEmail
    })
  });

  const data = await response.json();
  return data;
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(
  plan: PricingPlan,
  billingInterval: BillingInterval,
  companyEmail: string
): Promise<void> {
  try {
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe not loaded');

    // Create checkout session
    const { sessionId } = await createCheckoutSession(plan, billingInterval, companyEmail);

    // Redirect to Stripe Checkout
    // @ts-ignore - redirectToCheckout exists in Stripe.js but not in types
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
}

/**
 * Create customer portal session (for managing subscription)
 */
export async function createPortalSession(customerId: string): Promise<string> {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId })
  });

  const data = await response.json();
  return data.url;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string): Promise<any> {
  const response = await fetch(`/api/subscriptions/${subscriptionId}`);
  return response.json();
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST'
  });
}

/**
 * Update subscription (upgrade/downgrade)
 */
export async function updateSubscription(
  subscriptionId: string,
  newPlanId: string
): Promise<void> {
  await fetch(`/api/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId: newPlanId })
  });
}

/**
 * Get invoices
 */
export async function getInvoices(customerId: string): Promise<any[]> {
  const response = await fetch(`/api/customers/${customerId}/invoices`);
  return response.json();
}

/**
 * Get usage metrics
 */
export async function getUsageMetrics(companyId: string): Promise<any> {
  const response = await fetch(`/api/companies/${companyId}/usage`);
  return response.json();
}

// Mock functions for demo (remove in production)
export const mockStripeService = {
  async createCheckoutSession(plan: PricingPlan, interval: BillingInterval) {
    console.log('Mock: Creating checkout session', { plan: plan.name, interval });
    return {
      sessionId: 'mock_session_' + Date.now(),
      url: 'https://checkout.stripe.com/mock'
    };
  },

  async createSubscription(planId: string, companyId: string) {
    console.log('Mock: Creating subscription', { planId, companyId });
    return {
      id: 'sub_' + Date.now(),
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
};
