/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
  name: 'ACDS Enterprise',
  version: '1.0.0',
  description: 'Autonomous Company Diagnostic System',
} as const;

export const API_CONFIG = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'acds_auth_token',
  USER_PREFERENCES: 'acds_user_preferences',
  THEME: 'acds_theme',
} as const;

export const ANOMALY_DETECTION = {
  MIN_DATA_POINTS: 10,
  Z_SCORE_THRESHOLD: 2,
  CONFIDENCE_THRESHOLD: 75,
} as const;

export const HEALTH_SCORE = {
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 60,
  POOR: 40,
} as const;

export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;
