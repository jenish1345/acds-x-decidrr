/**
 * Environment configuration with type safety
 */

interface EnvConfig {
  apiUrl: string;
  apiTimeout: number;
  stripePublicKey: string;
  groqApiKey: string;
  groqModel: string;
  enableAI: boolean;
  enableAnalytics: boolean;
  enableDebug: boolean;
  appName: string;
  appVersion: string;
}

function getEnvVar(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue;
}

function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export const env: EnvConfig = {
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  stripePublicKey: getEnvVar('VITE_STRIPE_PUBLIC_KEY'),
  groqApiKey: getEnvVar('VITE_GROQ_API_KEY'),
  groqModel: getEnvVar('VITE_GROQ_MODEL', 'llama-3.3-70b-versatile'),
  enableAI: getEnvBool('VITE_ENABLE_AI_FEATURES', true),
  enableAnalytics: getEnvBool('VITE_ENABLE_ANALYTICS', true),
  enableDebug: getEnvBool('VITE_ENABLE_DEBUG', false),
  appName: getEnvVar('VITE_APP_NAME', 'ACDS Enterprise'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
};

// Validate required environment variables in production
if (import.meta.env.PROD) {
  const requiredVars = ['VITE_API_URL', 'VITE_STRIPE_PUBLIC_KEY'];
  const missing = requiredVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
  }
}
