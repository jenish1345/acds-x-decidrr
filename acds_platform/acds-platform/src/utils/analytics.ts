/**
 * Analytics tracking utilities
 */

import { env } from '../config/env';
import { logger } from './logger';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class Analytics {
  private enabled: boolean;

  constructor() {
    this.enabled = env.enableAnalytics;
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string): void {
    if (!this.enabled) return;

    logger.debug('Analytics: Page view', { path, title });
    
    // Integration point for Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: path,
        page_title: title
      });
    }
  }

  /**
   * Track custom event
   */
  event(event: AnalyticsEvent): void {
    if (!this.enabled) return;

    logger.debug('Analytics: Event', event);

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  }

  /**
   * Track user action
   */
  trackAction(action: string, metadata?: Record<string, any>): void {
    this.event({
      category: 'User Action',
      action,
      label: JSON.stringify(metadata)
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.event({
      category: 'Error',
      action: error.name,
      label: error.message
    });

    logger.error('Tracked error', { error: error.message, ...context });
  }

  /**
   * Track performance metric
   */
  trackTiming(category: string, variable: string, time: number): void {
    if (!this.enabled) return;

    logger.debug('Analytics: Timing', { category, variable, time });

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: variable,
        value: time,
        event_category: category
      });
    }
  }
}

export const analytics = new Analytics();
