/**
 * Auth Service
 * @module AuthService
 * @author Board the Z Team
 * @version 1.0.0
 */

import { BaseService, ServiceResult } from './BaseService'
import { AuthRepository } from '../repositories/AuthRepository'
import { UserRepository } from '../repositories/UserRepository'
import { processField } from '../../shared/validations'
import { isNonEmptyString } from '../../shared/validations/typeGuards'
import { logger } from '../../shared/utils/logger'
import type { AuthUser, AuthServiceResult } from '../types/auth'

export class AuthService extends BaseService {
  private authRepository = new AuthRepository()
  private userRepository = new UserRepository()

  /**
   * Validate authentication credentials
   */
  private validateCredentials(email: unknown, password: unknown): {
    isValid: boolean
    errors: Record<string, string>
    sanitizedData?: { email: string; password: string }
  } {
    const errors: Record<string, string> = {}

    // Validate email
    const emailResult = processField(email, 'email', { required: true })
    if (emailResult.error) {
      errors.email = emailResult.error
    }

    // Validate password
    if (!isNonEmptyString(password)) {
      errors.password = 'Password is required'
    } else if (typeof password === 'string' && password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    const isValid = Object.keys(errors).length === 0

    return {
      isValid,
      errors,
      sanitizedData: isValid ? {
        email: emailResult.value as string,
        password: password as string
      } : undefined
    }
  }

  async signUp(email: string, password: string): Promise<AuthServiceResult> {
    try {
      // Validate input data
      const validation = this.validateCredentials(email, password)
      
      if (!validation.isValid) {
        logger.warn('Sign up validation failed', 'AuthService.signUp', {
          emailProvided: !!email,
          passwordProvided: !!password
        })
        
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        }
      }

      const { email: validEmail, password: validPassword } = validation.sanitizedData!

      // Sign up with auth repository
      const authResult = await this.authRepository.signUp(validEmail, validPassword)
      
      if (!authResult.success || !authResult.data) {
        return {
          success: false,
          error: authResult.error || 'Sign up failed'
        }
      }

      // Ensure user record exists in our database
      const userResult = await this.userRepository.findByEmail(validEmail)
      
      if (!userResult.success) {
        return {
          success: false,
          error: 'Failed to check user existence'
        }
      }

      let userData = userResult.data

      if (!userData) {
        // Create user record
        const createResult = await this.userRepository.create({ email: validEmail })
        
        if (!createResult.success) {
          return {
            success: false,
            error: 'Failed to create user record'
          }
        }
        
        userData = createResult.data!
      }

      logger.info('User signed up successfully', 'AuthService.signUp', {
        email: validEmail,
        userId: userData.id
      })

      return {
        success: true,
        redirectTo: '/onboarding/2',
        user: authResult.data
      }
    } catch (error) {
      logger.error('AuthService.signUp error:', 'AuthService.signUp')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up operation failed'
      }
    }
  }

  async signIn(email: string, password: string): Promise<AuthServiceResult> {
    try {
      // Validate input data
      const validation = this.validateCredentials(email, password)
      
      if (!validation.isValid) {
        logger.warn('Sign in validation failed', 'AuthService.signIn', {
          emailProvided: !!email,
          passwordProvided: !!password
        })
        
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        }
      }

      const { email: validEmail, password: validPassword } = validation.sanitizedData!

      // Sign in with auth repository
      const authResult = await this.authRepository.signIn(validEmail, validPassword)
      
      if (!authResult.success || !authResult.data) {
        return {
          success: false,
          error: authResult.error || 'Sign in failed'
        }
      }

      // Ensure user record exists in our database
      const userResult = await this.userRepository.findByEmail(validEmail)
      
      if (!userResult.success) {
        return {
          success: false,
          error: 'Failed to check user existence'
        }
      }

      let userData = userResult.data

      if (!userData) {
        // Create user record if it doesn't exist
        const createResult = await this.userRepository.create({ email: validEmail })
        
        if (!createResult.success) {
          return {
            success: false,
            error: 'Failed to create user record'
          }
        }
        
        userData = createResult.data!
      }

      // Ensure profile exists
      const profileResult = await this.userRepository.findProfileByUserId(userData.id)
      
      if (profileResult.success && !profileResult.data) {
        await this.userRepository.upsertProfile(userData.id, {})
      }

      logger.info('User signed in successfully', 'AuthService.signIn', {
        email: validEmail,
        userId: userData.id
      })

      return {
        success: true,
        redirectTo: '/onboarding/2',
        user: authResult.data
      }
    } catch (error) {
      logger.error('AuthService.signIn error:', 'AuthService.signIn')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in operation failed'
      }
    }
  }

  async getCurrentUser(): Promise<ServiceResult<AuthUser | null>> {
    return this.handleOperation(async () => {
      const result = await this.authRepository.getCurrentUser()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get current user')
      }
      
      return result.data || null
    }, 'getCurrentUser', 'AuthService')
  }

}
