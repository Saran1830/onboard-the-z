'use server'

import { UserService } from '../services/UserService'
import { revalidatePath } from 'next/cache'
import type { UserProfileFlat } from '../../src/types/index'
import type { 
  OnboardingResult
} from '../types/actions'

const userService = new UserService()

export async function submitOnboardingStep(
  step: string,
  formData: Record<string, unknown>
): Promise<OnboardingResult> {
  try {
    const result = await userService.submitOnboardingStep(step, formData)

    if (result.success) {
      revalidatePath('/onboarding')
      revalidatePath('/data')
      
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        error: result.error || 'Server error occurred',
        validationErrors: result.validationErrors
      }
    }
  } catch (error) {
    console.error('Onboarding action submitOnboardingStep error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Submit onboarding step operation failed'
    }
  }
}

export async function getUserProfile(email: string): Promise<OnboardingResult> {
  try {
    const result = await userService.getUserProfile(email)

    return {
      success: result.success,
      data: result.data || {},
      error: result.error,
      validationErrors: result.validationErrors
    }
  } catch (error) {
    console.error('Onboarding action getUserProfile error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Get user profile operation failed'
    }
  }
}

export async function getAllUserProfiles(): Promise<UserProfileFlat[] | []> {
  try {
    const result = await userService.getAllUserProfiles()

    if (result.success) {
      return result.data || []
    } else {
      return []
    }
  } catch (error) {
    console.error('Onboarding action getAllUserProfiles error:', error)
    return []
  }
}