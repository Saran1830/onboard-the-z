/**
 * User Repository
 * @module UserRepository
 * @author Board the Z Team
 * @version 1.0.0
 */

import { supabaseServerClient } from "../utils/supabase/serverClient"
import { BaseRepository, RepositoryResult } from "./BaseRepository"
import type { UserData, UserProfile, UserProfileFlat } from "../../src/types/index"
import type { 
  CreateUserData
} from "../types/user"

export class UserRepository extends BaseRepository<UserData, string> {
  private supabase = supabaseServerClient()

  async findById(id: string): Promise<RepositoryResult<UserData | null>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }
        
        return data as UserData | null
      } catch (error) {
        console.error('UserRepository.findById error:', error)
        throw error instanceof Error ? error : new Error('Find user by ID operation failed')
      }
    }, 'findById')
  }

  async findByEmail(email: string): Promise<RepositoryResult<UserData | null>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle()

        if (error) {
          throw error
        }
        
        return data as UserData | null
      } catch (error) {
        console.error('UserRepository.findByEmail error:', error)
        throw error instanceof Error ? error : new Error('Find user by email operation failed')
      }
    }, 'findByEmail')
  }

  async create(userData: CreateUserData): Promise<RepositoryResult<UserData>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("users")
          .insert(userData)
          .select()
          .single()

        if (error || !data) {
          throw error || new Error('Failed to create user')
        }
        
        return data as UserData
      } catch (error) {
        console.error('UserRepository.create error:', error)
        throw error instanceof Error ? error : new Error('Create user operation failed')
      }
    }, 'create')
  }

  async update(id: string, userData: Partial<UserData>): Promise<RepositoryResult<UserData>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("users")
          .update(userData)
          .eq("id", id)
          .select()
          .single()

        if (error || !data) {
          throw error || new Error('Failed to update user')
        }
        
        return data as UserData
      } catch (error) {
        console.error('UserRepository.update error:', error)
        throw error instanceof Error ? error : new Error('Update user operation failed')
      }
    }, 'update')
  }

  async delete(id: string): Promise<RepositoryResult<boolean>> {
    return this.handleOperation(async () => {
      try {
        const { error } = await this.supabase
          .from("users")
          .delete()
          .eq("id", id)

        if (error) {
          throw error
        }
        
        return true
      } catch (error) {
        console.error('UserRepository.delete error:', error)
        throw error instanceof Error ? error : new Error('Delete user operation failed')
      }
    }, 'delete')
  }

  async findAll(): Promise<RepositoryResult<UserData[]>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }
        
        return (data || []) as UserData[]
      } catch (error) {
        console.error('UserRepository.findAll error:', error)
        throw error instanceof Error ? error : new Error('Find all users operation failed')
      }
    }, 'findAll')
  }

  // Profile-specific methods
  async findProfileByUserId(userId: string): Promise<RepositoryResult<UserProfile | null>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle()

        if (error) {
          throw error
        }
        
        return data as UserProfile | null
      } catch (error) {
        console.error('UserRepository.findProfileByUserId error:', error)
        throw error instanceof Error ? error : new Error('Find profile by user ID operation failed')
      }
    }, 'findProfileByUserId')
  }

  async upsertProfile(userId: string, profileData: Record<string, unknown>): Promise<RepositoryResult<UserProfile>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("user_profiles")
          .upsert([{
            user_id: userId,
            profile_data: profileData,
            updated_at: new Date().toISOString()
          }], { onConflict: "user_id" })
          .select()
          .single()

        if (error || !data) {
          throw error || new Error('Failed to upsert profile')
        }
        
        return data as UserProfile
      } catch (error) {
        console.error('UserRepository.upsertProfile error:', error)
        throw error instanceof Error ? error : new Error('Upsert profile operation failed')
      }
    }, 'upsertProfile')
  }

  async findAllProfilesWithUsers(): Promise<RepositoryResult<UserProfileFlat[]>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("user_profiles")
          .select("*, users:users(email)")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }
        
        type Row = UserProfile & { users?: { email: string | null } | null }

        const flattened: UserProfileFlat[] = (data as Row[] || []).map((r) => ({
          id: r.id,
          user_id: r.user_id,
          profile_data: r.profile_data,
          created_at: r.created_at,
          updated_at: r.updated_at,
          email: r.users?.email ?? ""
        }))

        return flattened
      } catch (error) {
        console.error('UserRepository.findAllProfilesWithUsers error:', error)
        throw error instanceof Error ? error : new Error('Find all profiles with users operation failed')
      }
    }, 'findAllProfilesWithUsers')
  }
}
