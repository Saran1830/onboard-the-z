/**
 * User and Profile type definitions
 * @module UserTypes
 * @author Board the Z Team
 * @version 1.0.0
 */

/**
 * Profile data type for onboarding form submissions
 */


// Repository Data Interfaces
export interface CreateUserData {
  email: string
}

// Service Result Interfaces
export interface OnboardingServiceResult {
  success: boolean
  error?: string
  data?: Record<string, unknown>
  validationErrors?: Record<string, string>
}
