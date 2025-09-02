/**
 * Auth Repository
 * @module AuthRepository
 * @author Board the Z Team
 * @version 1.0.0
 */

import { supabaseServerClientWithAuth } from "../utils/supabase/serverClient"
import { cookies } from 'next/headers'
import { RepositoryResult } from "./BaseRepository"
import type { AuthUser } from "../types/auth"

export class AuthRepository {
  
  private async getSupabaseClient() {
    return supabaseServerClientWithAuth(cookies())
  }

  /**
   * Handle repository operations with consistent error handling
   */
  private async handleOperation<R>(
    operation: () => Promise<R>,
    operationName: string
  ): Promise<RepositoryResult<R>> {
    try {
      const result = await operation()
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error(`Auth Repository error in ${operationName}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async signUp(email: string, password: string): Promise<RepositoryResult<AuthUser>> {
    return this.handleOperation(async () => {
      try {
        const supabase = await this.getSupabaseClient()
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password
        })

        if (authError) {
          throw new Error(authError.message)
        }

        if (!authData.user) {
          throw new Error('No user data returned from sign up')
        }

        return {
          id: authData.user.id,
          email: authData.user.email || email
        }
      } catch (error) {
        console.error('AuthRepository.signUp error:', error)
        throw error instanceof Error ? error : new Error('Sign up operation failed')
      }
    }, 'signUp')
  }

  async signIn(email: string, password: string): Promise<RepositoryResult<AuthUser>> {
    return this.handleOperation(async () => {
      try {
        const supabase = await this.getSupabaseClient()
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (authError) {
          throw new Error(authError.message)
        }

        if (!authData.user) {
          throw new Error('No user data returned from sign in')
        }

        return {
          id: authData.user.id,
          email: authData.user.email || email
        }
      } catch (error) {
        console.error('AuthRepository.signIn error:', error)
        throw error instanceof Error ? error : new Error('Sign in operation failed')
      }
    }, 'signIn')
  }

  async getCurrentUser(): Promise<RepositoryResult<AuthUser | null>> {
    return this.handleOperation(async () => {
      try {
        const supabase = await this.getSupabaseClient()
        
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          throw new Error(error.message)
        }
        
        if (!user) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email || ''
        }
      } catch (error) {
        console.error('AuthRepository.getCurrentUser error:', error)
        throw error instanceof Error ? error : new Error('Get current user operation failed')
      }
    }, 'getCurrentUser')
  }
}
