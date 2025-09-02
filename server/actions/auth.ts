'use server'

import { AuthService } from '../services/AuthService'
import { revalidatePath } from 'next/cache'
import type { 
  AuthResult
} from '../types/actions'

const authService = new AuthService()

export async function signUpUser(email: string, password: string): Promise<AuthResult> {
  const result = await authService.signUp(email, password)

  if (result.success) {
    revalidatePath('/onboarding')
    return {
      success: true,
      redirectTo: result.redirectTo || '/onboarding/2'
    }
  } else {
    return {
      success: false,
      error: result.error || 'Sign up failed',
      validationErrors: result.validationErrors
    }
  }
}

export async function signInUser(email: string, password: string): Promise<AuthResult> {
  const result = await authService.signIn(email, password)

  if (result.success) {
    revalidatePath('/onboarding')
    return {
      success: true,
      redirectTo: result.redirectTo || '/onboarding/2'
    }
  } else {
    return {
      success: false,
      error: result.error || 'Sign in failed',
      validationErrors: result.validationErrors
    }
  }
}

export async function getCurrentUser() {
  const result = await authService.getCurrentUser()

  if (result.success) {
    return result.data || null
  } else {
    return null
  }
}
