/**
 * Server Actions type definitions
 * @module ActionTypes
 * @author Board the Z Team
 * @version 1.0.0
 */

/**
 * Generic result interface for server actions
 */
export interface ActionResult {
  success: boolean
  error?: string
  data?: unknown
  validationErrors?: Record<string, string>
}

/**
 * Authentication result interface for auth actions
 */
export interface AuthResult {
  success: boolean
  error?: string
  redirectTo?: string
  validationErrors?: Record<string, string>
}

/**
 * Admin operations result interface
 */
export interface AdminResult {
  success: boolean
  error?: string
  data?: unknown
  validationErrors?: Record<string, string>
}

/**
 * Onboarding operations result interface
 */
export interface OnboardingResult {
  success: boolean
  error?: string
  data?: Record<string, unknown>
  validationErrors?: Record<string, string>
}

/**
 * Component creation data interface
 */
export interface ComponentCreationData {
  name: string
  label: string
  type: "number" | "textarea" | "text" | "email" | "date" | "phone" | "url" | "address"
  required: boolean
  placeholder: string
  options: string[] | null
}
