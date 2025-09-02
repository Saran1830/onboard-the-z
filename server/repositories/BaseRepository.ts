/**
 * Base Repository Interface
 * @module BaseRepository
 * @author Board the Z Team
 * @version 1.0.0
 */

/**
 * Generic repository result interface
 */
export interface RepositoryResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Base repository interface with common CRUD operations
 */
export interface IBaseRepository<T, K = string> {
  findById(id: K): Promise<RepositoryResult<T | null>>
  create(data: Partial<T>): Promise<RepositoryResult<T>>
  update(id: K, data: Partial<T>): Promise<RepositoryResult<T>>
  delete(id: K): Promise<RepositoryResult<boolean>>
  findAll(): Promise<RepositoryResult<T[]>>
}

/**
 * Abstract base repository class
 */
export abstract class BaseRepository<T, K = string> implements IBaseRepository<T, K> {
  
  /**
   * Handle repository operations with consistent error handling
   */
  protected async handleOperation<R>(
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
      console.error(`Repository error in ${operationName}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  abstract findById(id: K): Promise<RepositoryResult<T | null>>
  abstract create(data: Partial<T>): Promise<RepositoryResult<T>>
  abstract update(id: K, data: Partial<T>): Promise<RepositoryResult<T>>
  abstract delete(id: K): Promise<RepositoryResult<boolean>>
  abstract findAll(): Promise<RepositoryResult<T[]>>
}
