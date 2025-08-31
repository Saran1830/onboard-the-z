'use server'

import { AuthModel } from '../models/Auth'
import { revalidatePath } from 'next/cache'

export interface AuthResult {
  success: boolean
  error?: string
  redirectTo?: string
}

export async function signUpUser(email: string, password: string): Promise<AuthResult> {
  const authModel = new AuthModel()
  
  try {
    const result = await authModel.signUp(email, password)
    
    if (result.success) {
      revalidatePath('/onboarding')
      return {
        success: true,
        redirectTo: '/onboarding/2'
      }
    } else {
      return result
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      error: 'Network or server error'
    }
  }
}

export async function signInUser(email: string, password: string): Promise<AuthResult> {
  const authModel = new AuthModel()
  
  try {
    console.log('Starting sign in for:', email)
    const result = await authModel.signIn(email, password)
    console.log('Auth model result:', { success: result.success, error: result.error })
    
    if (result.success) {
      revalidatePath('/onboarding')
      return {
        success: true,
        redirectTo: '/onboarding/2'
      }
    } else {
      return result
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: 'Network or server error'
    }
  }
}

export async function getCurrentUser() {
  const authModel = new AuthModel()
  
  try {
    return await authModel.getCurrentUser()
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
