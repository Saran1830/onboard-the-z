/**
 * User Service
 * @module UserService
 * @author Board the Z Team
 * @version 1.0.0
 */

import { BaseService, ServiceResult } from './BaseService'
import { UserRepository } from '../repositories/UserRepository'
import { processField } from '../../shared/validations'
import { isString, isNumber, isObject } from '../../shared/validations/typeGuards'
import { logger } from '../../shared/utils/logger'
import type { UserProfile, UserProfileFlat } from '../../src/types/index'
import type { OnboardingServiceResult } from '../types/user'

export class UserService extends BaseService {
  private userRepository = new UserRepository()

  /**
   * Validate onboarding step data
   */
  private validateOnboardingStep(
    step: unknown,
    formData: unknown
  ): {
    isValid: boolean
    errors: Record<string, string>
    sanitizedData?: {
      step: number
      email: string
      profileData: Record<string, unknown>
    }
  } {
    const errors: Record<string, string> = {}

    // Validate step number
    let stepNum: number
    if (isString(step)) {
      stepNum = parseInt(step)
      if (isNaN(stepNum) || stepNum < 1 || stepNum > 10) {
        errors.step = 'Step must be a valid number between 1 and 10'
      }
    } else if (isNumber(step)) {
      stepNum = step
      if (stepNum < 1 || stepNum > 10) {
        errors.step = 'Step must be a valid number between 1 and 10'
      }
    } else {
      errors.step = 'Step is required and must be a number'
      stepNum = 0
    }

    // Validate form data
    if (!isObject(formData)) {
      errors.formData = 'Form data must be an object'
      return { isValid: false, errors }
    }

    const { email, ...profileData } = formData

    // Validate email
    const emailResult = processField(email, 'email', { required: true })
    if (emailResult.error) {
      errors.email = emailResult.error
    }

    const isValid = Object.keys(errors).length === 0

    return {
      isValid,
      errors,
      sanitizedData: isValid ? {
        step: stepNum,
        email: emailResult.value as string,
        profileData
      } : undefined
    }
  }

  async submitOnboardingStep(
    step: string,
    formData: Record<string, unknown>
  ): Promise<OnboardingServiceResult> {
    try {
      // Validate input data
      const validation = this.validateOnboardingStep(step, formData)
      
      if (!validation.isValid) {
        logger.warn('Onboarding step validation failed', 'UserService.submitOnboardingStep', {
          step,
          errorCount: Object.keys(validation.errors).length
        })
        
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        }
      }

      const { step: stepNum, email, profileData } = validation.sanitizedData!

      return this.handleOperation(async () => {
        // Get user by email
        const userResult = await this.userRepository.findByEmail(email)

        if (!userResult.success || !userResult.data) {
          throw new Error('User not found')
        }

        const user = userResult.data

        // Get existing profile to merge data
        const existingProfileResult = await this.userRepository.findProfileByUserId(user.id)
        
        if (!existingProfileResult.success) {
          throw new Error('Failed to fetch existing profile')
        }

        const existingData = existingProfileResult.data?.profile_data || {}
        const mergedData = {
          ...existingData,
          ...profileData,
          last_updated: new Date().toISOString()
        }

        // Update user profile with step data
        const profileResult = await this.userRepository.upsertProfile(user.id, mergedData)

        if (!profileResult.success) {
          throw new Error('Failed to update profile')
        }

        logger.info('Onboarding step submitted successfully', 'UserService.submitOnboardingStep', {
          step: stepNum,
          email,
          userId: user.id
        })

        return { step: stepNum }
      }, 'submitOnboardingStep', 'UserService')
    } catch (error) {
      logger.error('UserService.submitOnboardingStep error:', 'UserService.submitOnboardingStep')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Submit onboarding step operation failed'
      }
    }
  }

  async getUserProfile(email: string): Promise<OnboardingServiceResult> {
    try {
      // Validate email
      const emailResult = processField(email, 'email', { required: true })
      if (emailResult.error) {
        return {
          success: false,
          error: 'Invalid email address',
          validationErrors: { email: emailResult.error }
        }
      }

      const validEmail = emailResult.value as string

      return this.handleOperation(async () => {
        // Get user and their profile
        const userResult = await this.userRepository.findByEmail(validEmail)

        if (!userResult.success) {
          throw new Error('Failed to find user')
        }

        if (!userResult.data) {
          return {}
        }

        const profileResult = await this.userRepository.findProfileByUserId(userResult.data.id)
        
        if (!profileResult.success) {
          throw new Error('Failed to fetch profile')
        }

        return profileResult.data?.profile_data || {}
      }, 'getUserProfile', 'UserService')
    } catch (error) {
      logger.error('UserService.getUserProfile error:', 'UserService.getUserProfile')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Get user profile operation failed'
      }
    }
  }

  async getAllUserProfiles(): Promise<ServiceResult<UserProfileFlat[]>> {
    try {
      return this.handleOperation(async () => {
        const result = await this.userRepository.findAllProfilesWithUsers()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch user profiles')
        }
        
        return result.data || []
      }, 'getAllUserProfiles', 'UserService')
    } catch (error) {
      logger.error('UserService.getAllUserProfiles error:', 'UserService.getAllUserProfiles')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Get all user profiles operation failed'
      }
    }
  }

  async updateUserProfile(
    userId: string, 
    profileData: Record<string, unknown>
  ): Promise<ServiceResult<UserProfile>> {
    return this.handleOperation(async () => {
      const result = await this.userRepository.upsertProfile(userId, profileData)
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update profile')
      }
      
      return result.data
    }, 'updateUserProfile', 'UserService')
  }
}
