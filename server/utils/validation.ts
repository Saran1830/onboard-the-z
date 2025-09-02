/**
 * Server-side validation utilities that extend shared validations
 * for database operations and server-specific logic
 */

import {
  processField,
  processFormData,
  sanitizeComponentName,
  validateComponentName
} from '../../shared/validations'
import {
  isString,
  isNumber,
  isBoolean,
  isStringArray,
  isNonEmptyString,
  isObject,
  isInteger,
  isPositiveNumber
} from '../../shared/validations/typeGuards'
import { logger } from '../../shared/utils/logger'

export interface ValidationResult<T = unknown> {
  isValid: boolean
  data?: T
  errors: Record<string, string>
  sanitizedData?: Record<string, unknown>
}

/**
 * Validate component creation data
 */
export function validateComponentCreation(
  data: unknown
): ValidationResult<{
  name: string
  label: string
  type: string
  required: boolean
  placeholder: string
  options: string[] | null
}> {
  const errors: Record<string, string> = {}

  if (!isObject(data)) {
    return {
      isValid: false,
      errors: { general: 'Invalid data format' }
    }
  }

  const {
    name,
    label,
    type,
    required,
    placeholder,
    options
  } = data

  // Validate name
  if (!isNonEmptyString(name)) {
    errors.name = 'Component name is required'
  } else {
    const nameValidation = validateComponentName(name)
    if (nameValidation) {
      errors.name = nameValidation
    }
  }

  // Validate label
  if (!isNonEmptyString(label)) {
    errors.label = 'Component label is required'
  }

  // Validate type
  const validTypes = ["number", "textarea", "text", "email", "date", "phone", "url", "address"]
  if (!isString(type) || !validTypes.includes(type)) {
    errors.type = 'Invalid component type'
  }

  // Validate required
  if (!isBoolean(required)) {
    errors.required = 'Required field must be a boolean'
  }

  // Validate placeholder
  if (!isString(placeholder)) {
    errors.placeholder = 'Placeholder must be a string'
  }

  // Validate options
  if (options !== null && !isStringArray(options)) {
    errors.options = 'Options must be an array of strings or null'
  }

  const isValid = Object.keys(errors).length === 0

  if (isValid) {
    // Sanitize data
    const sanitizedData = {
      name: sanitizeComponentName(name),
      label: processField(label, 'text').value as string,
      type: type as string,
      required: required as boolean,
      placeholder: processField(placeholder, 'text').value as string,
      options: options as string[] | null
    }

    return {
      isValid: true,
      data: sanitizedData,
      errors: {},
      sanitizedData
    }
  }

  return {
    isValid: false,
    errors
  }
}

/**
 * Validate page configuration update data
 */
export function validatePageConfigUpdate(
  page: unknown,
  components: unknown
): ValidationResult<{
  page: number
  components: string[]
}> {
  const errors: Record<string, string> = {}

  // Validate page number
  if (!isNumber(page) || !isInteger(page) || !isPositiveNumber(page)) {
    errors.page = 'Page must be a positive integer'
  }

  // Validate components array
  if (!isStringArray(components)) {
    errors.components = 'Components must be an array of strings'
  } else {
    // Validate each component ID
    components.forEach((componentId, index) => {
      if (!isNonEmptyString(componentId)) {
        errors[`component_${index}`] = `Component at index ${index} must be a non-empty string`
      }
    })
  }

  const isValid = Object.keys(errors).length === 0

  if (isValid) {
    // Sanitize component IDs
    const sanitizedComponents = (components as string[])
      .map(componentId => processField(componentId, 'text').value as string)
      .filter(id => isNonEmptyString(id))

    return {
      isValid: true,
      data: {
        page: page as number,
        components: sanitizedComponents
      },
      errors: {},
      sanitizedData: {
        page,
        components: sanitizedComponents
      }
    }
  }

  return {
    isValid: false,
    errors
  }
}

/**
 * Validate user profile data using shared validations
 */
export function validateUserProfile(
  data: unknown
): ValidationResult<Record<string, unknown>> {
  if (!isObject(data)) {
    return {
      isValid: false,
      errors: { general: 'Invalid data format' }
    }
  }

  const schema = {
    firstName: { type: 'text' as const, required: true, minLength: 2, maxLength: 50 },
    lastName: { type: 'text' as const, required: true, minLength: 2, maxLength: 50 },
    email: { type: 'email' as const, required: true },
    phone: { type: 'phone' as const, required: false },
    website: { type: 'url' as const, required: false }
  }

  const result = processFormData(data, schema)

  return {
    isValid: result.isValid,
    data: result.isValid ? result.sanitizedData : undefined,
    errors: result.errors,
    sanitizedData: result.sanitizedData
  }
}

/**
 * Log validation results for debugging and monitoring
 */
export function logValidationResult<T>(
  operation: string,
  result: ValidationResult<T>,
  context?: string
): void {
  if (result.isValid) {
    logger.debug(`Validation passed for ${operation}`, context)
  } else {
    logger.warn(`Validation failed for ${operation}`, context, {
      errorCount: Object.keys(result.errors).length,
      errors: JSON.stringify(result.errors)
    })
  }
}

/**
 * Sanitize database input to prevent injection attacks
 */
export function sanitizeDatabaseInput(input: unknown): string {
  if (!isString(input)) {
    return ''
  }

  return input
    .trim()
    .replace(/['"\\;]/g, '') // Remove potentially dangerous characters
    .substring(0, 1000) // Limit length
}

/**
 * Validate ID parameters (numeric IDs)
 */
export function validateId(id: unknown, fieldName = 'id'): ValidationResult<number> {
  if (!isNumber(id) || !isInteger(id) || !isPositiveNumber(id)) {
    return {
      isValid: false,
      errors: {
        [fieldName]: `${fieldName} must be a positive integer`
      }
    }
  }

  return {
    isValid: true,
    data: id,
    errors: {}
  }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page: unknown,
  limit: unknown
): ValidationResult<{ page: number; limit: number }> {
  const errors: Record<string, string> = {}

  if (!isNumber(page) || !isInteger(page) || page < 1) {
    errors.page = 'Page must be a positive integer'
  }

  if (!isNumber(limit) || !isInteger(limit) || limit < 1 || limit > 100) {
    errors.limit = 'Limit must be an integer between 1 and 100'
  }

  const isValid = Object.keys(errors).length === 0

  return {
    isValid,
    data: isValid ? { page: page as number, limit: limit as number } : undefined,
    errors
  }
}
