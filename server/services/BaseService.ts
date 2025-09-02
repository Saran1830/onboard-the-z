/**
 * Base Service Interface
 * @module BaseService
 * @author Board the Z Team
 * @version 1.0.0
 */

/**
 * Service result interface
 */
export interface ServiceResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  validationErrors?: Record<string, string>
}

/**
 * Abstract base service class
 */
export abstract class BaseService {
  
  /**
   * Handle service operations with consistent error handling
   */
  protected async handleOperation<R>(
    operation: () => Promise<R>,
    operationName: string,
    serviceName: string
  ): Promise<ServiceResult<R>> {
    try {
      const result = await operation()
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error(`Service error in ${serviceName}.${operationName}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Handle validation errors
   */
  protected createValidationError(
    message: string, 
    validationErrors: Record<string, string>
  ): ServiceResult {
    return {
      success: false,
      error: message,
      validationErrors
    }
  }
}
