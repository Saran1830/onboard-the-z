/**
 * Validation Constants and Utilities
 * Centralized validation patterns and limits
 */

import { APP_CONFIG } from '../config/app.config'

// Export validation patterns for easy access
export const VALIDATION_PATTERNS = APP_CONFIG.onboarding.validation.patterns
export const VALIDATION_LIMITS = {
  text: APP_CONFIG.onboarding.validation.textLimits,
  componentName: APP_CONFIG.onboarding.validation.componentNameLimits
}

// Validation functions
export const validateEmail = (email: string): boolean =>
  VALIDATION_PATTERNS.email.test(email)

export const validatePhone = (phone: string): boolean =>
  VALIDATION_PATTERNS.phone.test(phone.replace(/\s/g, ''))

export const validateZipCode = (zipCode: string): boolean =>
  VALIDATION_PATTERNS.zipCode.test(zipCode.trim())

export const validateComponentName = (name: string): boolean =>
  VALIDATION_PATTERNS.componentName.test(name) &&
  name.length >= VALIDATION_LIMITS.componentName.min &&
  name.length <= VALIDATION_LIMITS.componentName.max

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return VALIDATION_PATTERNS.url.test(url)
  } catch {
    return false
  }
}

export const validateTextLength = (text: string): boolean =>
  text.length >= VALIDATION_LIMITS.text.min &&
  text.length <= VALIDATION_LIMITS.text.max

// Error messages
export const VALIDATION_MESSAGES = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  zipCode: 'Please enter a valid ZIP code',
  componentName: `Component name must be ${VALIDATION_LIMITS.componentName.min}-${VALIDATION_LIMITS.componentName.max} characters, lowercase letters and underscores only`,
  url: 'Please enter a valid URL',
  textLength: `Text must be between ${VALIDATION_LIMITS.text.min} and ${VALIDATION_LIMITS.text.max} characters`,
  required: 'This field is required',
  passwordMismatch: 'Passwords do not match'
}

// Address validation
export const ADDRESS_FIELDS = APP_CONFIG.components.special.address.requiredFields

export const validateAddressField = (fieldName: string, value: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
  }
  
  if (fieldName === 'zipCode' && !validateZipCode(value)) {
    return VALIDATION_MESSAGES.zipCode
  }
  
  return null
}

export const validateCompleteAddress = (address: Record<string, string>): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  ADDRESS_FIELDS.forEach(field => {
    const error = validateAddressField(field, address[field] || '')
    if (error) {
      errors[`address.${field}`] = error
    }
  })
  
  return errors
}
