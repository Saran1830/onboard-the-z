
import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'
import { UserModel } from './User'

export interface AuthResult {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
  }
}

export class AuthModel {
  private async getSupabaseClient() {
    return createClient(cookies())
  }
  private userModel = new UserModel()

  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = await this.getSupabaseClient()
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) {
        return {
          success: false,
          error: authError.message
        }
      }

      if (authData.user) {
        // Ensure user record exists in our database
        let user = await this.userModel.findByEmail(email)
        if (!user) {
          user = await this.userModel.create({ email })
        }

        if (user) {
          return {
            success: true,
            user: {
              id: user.id,
              email: user.email
            }
          }
        }
      }

      return {
        success: false,
        error: 'Failed to create user record'
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return {
        success: false,
        error: 'Network or server error'
      }
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = await this.getSupabaseClient()
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        return {
          success: false,
          error: authError.message
        }
      }

      if (authData.user) {
        // Ensure user record exists in our database
        let user = await this.userModel.findByEmail(email)
        if (!user) {
          user = await this.userModel.create({ email })
        }

        // Ensure profile exists
        if (user) {
          const profile = await this.userModel.getProfile(user.id)
          if (!profile) {
            await this.userModel.createOrUpdateProfile(user.id, {})
          }
        }

        if (user) {
          return {
            success: true,
            user: {
              id: user.id,
              email: user.email
            }
          }
        }
      }

      return {
        success: false,
        error: 'Authentication failed'
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return {
        success: false,
        error: 'Network or server error'
      }
    }
  }

  async getCurrentUser(): Promise<{ id: string; email: string } | null> {
    try {
      const supabase = await this.getSupabaseClient()
      // Get user from server-side with cookies
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }
      
      return {
        id: user.id,
        email: user.email || ''
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }
}