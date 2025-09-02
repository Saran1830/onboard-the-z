/**
 * Authentication-related type definitions
 * @module AuthTypes
 * @author Board the Z Team
 * @version 1.0.0
 */

/**
 * User data interface for authentication operations
 */
export interface AuthUser {
  id: string
  email: string
  created_at?: string
  updated_at?: string
}

/**
 * Authentication session data
 */
export interface AuthSession {
  user: AuthUser
  access_token?: string
  refresh_token?: string
  expires_at?: number
}

// Service Result Interfaces
export interface AuthServiceResult {
  success: boolean
  error?: string
  redirectTo?: string
  validationErrors?: Record<string, string>
  user?: AuthUser
}
