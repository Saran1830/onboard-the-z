'use server'

import { UserModel } from '../models/User'
import { revalidatePath } from 'next/cache'

import type { UserProfile, UserProfileFlat } from '../../src/types/index'

export interface OnboardingResult {
  success: boolean
  error?: string
  data?: Record<string, unknown>
}

export async function submitOnboardingStep(
  step: string,
  formData: Record<string, unknown>
): Promise<OnboardingResult> {
  const userModel = new UserModel()
  
  try {
    const stepNum = parseInt(step)
    const { email, ...profileData } = formData

    if (typeof email !== 'string' || !email) {
      return {
        success: false,
        error: 'Email is required'
      }
    }

    // Get user by email
    const user = await userModel.findByEmail(email)

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    // Update user profile with step data
    const profile = await userModel.createOrUpdateProfile(user.id, {
      ...profileData,
      last_updated: new Date().toISOString()
    })

    if (!profile) {
      return {
        success: false,
        error: 'Failed to update profile'
      }
    }

    revalidatePath('/onboarding')
    revalidatePath('/data')
    
    return {
      success: true,
      data: { step: stepNum }
    }

  } catch (error) {
    console.error('Error submitting onboarding step:', error)
    return {
      success: false,
      error: 'Server error occurred'
    }
  }
}

export async function getUserProfile(email: string): Promise<OnboardingResult> {
  const userModel = new UserModel()
  
  try {
    // Get user and their profile
    const user = await userModel.findByEmail(email)

    if (!user) {
      return {
        success: true,
        data: {}
      }
    }

    const profile = await userModel.getProfile(user.id)

    return {
      success: true,
      data: profile?.profile_data || {}
    }

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return {
      success: true,
      data: {}
    }
  }
}

export async function getAllUserProfiles(): Promise<UserProfileFlat[] | []> {
  const userModel = new UserModel();
  try {
    const rows = await userModel.getAllProfiles(); 
    return rows ?? [];
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    return [];
  }
}