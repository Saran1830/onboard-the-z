/**
 * Environment Configuration
 * Provides fallback values and validation for environment variables
 */

export interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  app: {
    nodeEnv: 'development' | 'production' | 'test';
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
  };
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value || fallback || '';
}

/**
 * Validate required environment variables
 */
function validateEnvironment(): void {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
    console.warn('Using fallback values for build process');
  }
}

// Validate environment on import
validateEnvironment();

/**
 * Environment configuration with fallbacks
 */
export const env: EnvironmentConfig = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder-anon-key'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', 'placeholder-service-key'),
  },
  app: {
    nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
};

export default env;
