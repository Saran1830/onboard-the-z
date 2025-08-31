'use server'

import { ComponentModel } from '../models/Component'
import { revalidatePath } from 'next/cache'

export interface AdminResult {
  success: boolean
  error?: string
  data?: unknown
}

export async function getCustomComponents() {
  const componentModel = new ComponentModel()
  
  try {
    return await componentModel.getAllCustomComponents()
  } catch (error) {
    console.error('Error fetching custom components:', error)
    return []
  }
}

export async function createCustomComponent(
  component: {
    name: string
    label: string
    type: "number" | "textarea" | "text" | "email" | "date" | "phone" | "url"
    required: boolean
    placeholder: string
    options: string[] | null
  }
): Promise<AdminResult> {
  const componentModel = new ComponentModel()
  
  try {
    const result = await componentModel.createCustomComponent(component)
    
    if (result.success) {
      revalidatePath('/admin')
      return result
    } else {
      return result
    }
  } catch (error) {
    console.error('Error creating custom component:', error)
    return {
      success: false,
      error: 'Failed to create component'
    }
  }
}

export async function getPageConfigs() {
  const componentModel = new ComponentModel()
  
  try {
    return await componentModel.getAllPageConfigs()
  } catch (error) {
    console.error('Error fetching page configs:', error)
    return []
  }
}

export async function updatePageConfig(
  page: number,
  components: string[]
): Promise<AdminResult> {
  const componentModel = new ComponentModel()
  
  try {
    const result = await componentModel.updatePageConfig(page, components)
    
    if (result.success) {
      revalidatePath('/admin')
      revalidatePath('/onboarding')
      return result
    } else {
      return result
    }
  } catch (error) {
    console.error('Error updating page config:', error)
    return {
      success: false,
      error: 'Failed to update page config'
    }
  }
}

export async function initializeDefaults(): Promise<AdminResult> {
  const componentModel = new ComponentModel()
  
  try {
    const result = await componentModel.initializeDefaults()
    
    if (result.success) {
      revalidatePath('/admin')
      return result
    } else {
      return result
    }
  } catch (error) {
    console.error('Error initializing defaults:', error)
    return {
      success: false,
      error: 'Failed to initialize defaults'
    }
  }
}