/**
 * Component Service
 * @module ComponentService
 * @author Board the Z Team
 * @version 1.0.0
 */

import { BaseService, ServiceResult } from './BaseService'
import { ComponentRepository } from '../repositories/ComponentRepository'
import { 
  validateComponentCreation,
  validatePageConfigUpdate,
  logValidationResult
} from '../utils/validation'
import { logger } from '../../shared/utils/logger'
import type { CustomComponent, PageConfig, ComponentType } from '../../src/types/components'
import type { AdminServiceResult } from '../types/component'
import type { ComponentCreationData } from '../types/actions'

export class ComponentService extends BaseService {
  private componentRepository = new ComponentRepository()

  async getAllCustomComponents(): Promise<ServiceResult<CustomComponent[]>> {
    try {
      return this.handleOperation(async () => {
        const result = await this.componentRepository.findAll()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch components')
        }
        
        return result.data || []
      }, 'getAllCustomComponents', 'ComponentService')
    } catch (error) {
      logger.error('ComponentService.getAllCustomComponents error:', 'ComponentService.getAllCustomComponents')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Get all custom components operation failed'
      }
    }
  }

  async createCustomComponent(component: ComponentCreationData): Promise<AdminServiceResult> {
    try {
      // Validate input data
      const validation = validateComponentCreation(component)
      logValidationResult('createCustomComponent', validation, 'ComponentService.createCustomComponent')
      
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        }
      }

      return this.handleOperation(async () => {
        const result = await this.componentRepository.create({
          ...validation.data!,
          type: validation.data!.type as ComponentType
        })
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to create component')
        }
        
        logger.info('Component created successfully', 'ComponentService.createCustomComponent', {
          componentName: validation.data!.name,
          componentType: validation.data!.type
        })
        
        return result.data
      }, 'createCustomComponent', 'ComponentService')
    } catch (error) {
      logger.error('ComponentService.createCustomComponent error:', 'ComponentService.createCustomComponent')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Create custom component operation failed'
      }
    }
  }

  async getAllPageConfigs(): Promise<ServiceResult<PageConfig[]>> {
    try {
      return this.handleOperation(async () => {
        const result = await this.componentRepository.findAllPageConfigs()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch page configs')
        }
        
        return result.data || []
      }, 'getAllPageConfigs', 'ComponentService')
    } catch (error) {
      logger.error('ComponentService.getAllPageConfigs error:', 'ComponentService.getAllPageConfigs')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Get all page configs operation failed'
      }
    }
  }

  async updatePageConfig(page: number, components: string[]): Promise<AdminServiceResult> {
    try {
      // Validate input data
      const validation = validatePageConfigUpdate(page, components)
      logValidationResult('updatePageConfig', validation, 'ComponentService.updatePageConfig')
      
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        }
      }

      return this.handleOperation(async () => {
        // Business rule: Pages 2 and 3 must have at least one component
        if ((page === 2 || page === 3) && components.length === 0) {
          throw new Error("Pages 2 and 3 must have at least one component")
        }

        // Validate that all components exist
        const validationResult = await this.componentRepository.validateComponentsExist(components)
        
        if (!validationResult.success) {
          throw new Error(validationResult.error || 'Component validation failed')
        }

        const result = await this.componentRepository.updatePageConfig(page, { components })
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to update page config')
        }
        
        logger.info('Page config updated successfully', 'ComponentService.updatePageConfig', {
          page,
          componentCount: components.length
        })
        
        return result.data
      }, 'updatePageConfig', 'ComponentService')
    } catch (error) {
      logger.error('ComponentService.updatePageConfig error:', 'ComponentService.updatePageConfig')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update page config operation failed'
      }
    }
  }

  async initializeDefaults(): Promise<AdminServiceResult> {
    try {
      return this.handleOperation(async () => {
        // This method would initialize default components and page configs
        // For now, we'll just return success - implement as needed
        
        logger.info('Defaults initialized', 'ComponentService.initializeDefaults')
        
        return { success: true }
      }, 'initializeDefaults', 'ComponentService')
    } catch (error) {
      logger.error('ComponentService.initializeDefaults error:', 'ComponentService.initializeDefaults')
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Initialize defaults operation failed'
      }
    }
  }
}
