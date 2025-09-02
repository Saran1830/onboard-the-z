'use server'

import { ComponentService } from '../services/ComponentService'
import { revalidatePath } from 'next/cache'
import type { 
  AdminResult, 
  ComponentCreationData 
} from '../types/actions'

const componentService = new ComponentService()

export async function getCustomComponents() {
  try {
    const result = await componentService.getAllCustomComponents()

    if (result.success) {
      return result.data || []
    } else {
      return []
    }
  } catch (error) {
    console.error('Admin action getCustomComponents error:', error)
    return []
  }
}

export async function createCustomComponent(
  component: ComponentCreationData
): Promise<AdminResult> {
  try {
    const result = await componentService.createCustomComponent(component)

    if (result.success) {
      revalidatePath('/admin')
      return result
    } else {
      return {
        success: false,
        error: result.error || 'Failed to create component',
        validationErrors: result.validationErrors
      }
    }
  } catch (error) {
    console.error('Admin action createCustomComponent error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Create component operation failed'
    }
  }
}

export async function getPageConfigs() {
  try {
    const result = await componentService.getAllPageConfigs()

    if (result.success) {
      return result.data || []
    } else {
      return []
    }
  } catch (error) {
    console.error('Admin action getPageConfigs error:', error)
    return []
  }
}

export async function updatePageConfig(
  page: number,
  components: string[]
): Promise<AdminResult> {
  try {
    const result = await componentService.updatePageConfig(page, components)

    if (result.success) {
      revalidatePath('/admin')
      revalidatePath('/onboarding')
      return result
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update page config',
        validationErrors: result.validationErrors
      }
    }
  } catch (error) {
    console.error('Admin action updatePageConfig error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update page config operation failed'
    }
  }
}

export async function initializeDefaults(): Promise<AdminResult> {
  try {
    const result = await componentService.initializeDefaults()

    if (result.success) {
      revalidatePath('/admin')
      return result
    } else {
      return {
        success: false,
        error: result.error || 'Failed to initialize defaults'
      }
    }
  } catch (error) {
    console.error('Admin action initializeDefaults error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Initialize defaults operation failed'
    }
  }
}