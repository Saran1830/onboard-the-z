/**
 * Route Constants
 * Centralized route definitions
 */

import { APP_CONFIG } from '../config/app.config'

// Step numbers
export const STEP_NUMBERS = {
  first: 1,
  second: 2,
  third: 3
} as const;

// Step configuration
export const STEP_CONFIG = {
  min: STEP_NUMBERS.first,
  max: STEP_NUMBERS.third,
  total: 3
} as const;

// Main route categories
export const ROUTES = {
  // Root
  HOME: '/',
  
  // Onboarding routes
  ONBOARDING: {
    START: APP_CONFIG.onboarding.routes.start,
    SUCCESS: APP_CONFIG.onboarding.routes.success,
    STEP: (step: number) => `/onboarding/${step}`,
    AUTH_REDIRECT: APP_CONFIG.onboarding.routes.authRedirect
  },
  
  // Application routes
  DASHBOARD: APP_CONFIG.onboarding.routes.dataPage,
  ADMIN: '/admin',
  
  // API routes (if needed)
  API: {
    AUTH: '/api/auth',
    ONBOARDING: '/api/onboarding',
    ADMIN: '/api/admin'
  }
} as const

// Route helper functions
export const getOnboardingStepRoute = (step: number): string =>
  ROUTES.ONBOARDING.STEP(step)

export const getOnboardingStartRoute = (): string =>
  ROUTES.ONBOARDING.START

export const getOnboardingSuccessRoute = (): string =>
  ROUTES.ONBOARDING.SUCCESS

export const getDashboardRoute = (): string =>
  ROUTES.DASHBOARD

export const getAdminRoute = (): string =>
  ROUTES.ADMIN

// Route validation
export const isOnboardingRoute = (pathname: string): boolean =>
  pathname.startsWith('/onboarding')

export const isAdminRoute = (pathname: string): boolean =>
  pathname.startsWith('/admin')

export const isDashboardRoute = (pathname: string): boolean =>
  pathname === ROUTES.DASHBOARD

// Extract step number from onboarding route
export const getStepFromRoute = (pathname: string): number | null => {
  const match = pathname.match(/^\/onboarding\/(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}
