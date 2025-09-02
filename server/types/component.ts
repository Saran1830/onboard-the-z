/**
 * Component and Page configuration type definitions
 * @module ComponentTypes
 * @author Board the Z Team
 * @version 1.0.0
 */

/**
 * Custom component interface for onboarding forms
 */
export interface CustomComponent {
  id: string
  name: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  created_at?: string
  updated_at?: string
}

/**
 * Page configuration for onboarding steps
 */
export interface PageConfig {
  page: number
  components: string[] // Array of component IDs
  created_at?: string
  updated_at?: string
}

// Repository Data Interfaces
export interface CreateComponentData {
  name: string
  label: string
  type: ComponentType
  required: boolean
  placeholder: string
  options: string[] | null
}

export interface UpdatePageConfigData {
  components: string[]
}

// Service Result Interfaces
export interface AdminServiceResult {
  success: boolean
  error?: string
  data?: unknown
  validationErrors?: Record<string, string>
}

// Import ComponentType from frontend types
import type { ComponentType } from '../../src/types/components'
