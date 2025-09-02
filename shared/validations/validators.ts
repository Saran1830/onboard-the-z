import { isString, isNonEmptyString } from './typeGuards';
import { 
  VALIDATION_REGEX, 
  ERROR_MESSAGES, 
  LENGTH_LIMITS
} from './constants';

// Email validation
export function isValidEmail(email: string): boolean {
  return VALIDATION_REGEX.email.test(email);
}

export function validateEmail(value: unknown): string | null {
  if (!isString(value)) return ERROR_MESSAGES.email.mustBeString;
  if (!isNonEmptyString(value)) return ERROR_MESSAGES.email.required;
  if (!isValidEmail(value)) return ERROR_MESSAGES.email.invalid;
  return null;
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateUrl(value: unknown): string | null {
  if (!isString(value)) return ERROR_MESSAGES.url.mustBeString;
  if (!isNonEmptyString(value)) return ERROR_MESSAGES.url.required;
  if (!isValidUrl(value)) return ERROR_MESSAGES.url.invalid;
  return null;
}

// Phone validation
export function isValidPhone(phone: string): boolean {
  return VALIDATION_REGEX.phone.test(phone.replace(/\s/g, ''));
}

export function validatePhone(value: unknown): string | null {
  if (!isString(value)) return ERROR_MESSAGES.phone.mustBeString;
  if (!isNonEmptyString(value)) return ERROR_MESSAGES.phone.required;
  if (!isValidPhone(value)) return ERROR_MESSAGES.phone.invalid;
  return null;
}

// Date validation
export function isValidDateString(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.getTime() > 0;
}

export function validateDate(value: unknown): string | null {
  if (!isString(value)) return ERROR_MESSAGES.date.mustBeString;
  if (!isNonEmptyString(value)) return ERROR_MESSAGES.date.required;
  if (!isValidDateString(value)) return ERROR_MESSAGES.date.invalid;
  
  const date = new Date(value);
  const now = new Date();
  if (date > now) return ERROR_MESSAGES.date.future;
  
  return null;
}

// Text validation
export function validateText(value: unknown, minLength?: number, maxLength?: number): string | null {
  const min = minLength ?? LENGTH_LIMITS.text.min;
  const max = maxLength ?? LENGTH_LIMITS.text.max;
  
  if (!isString(value)) return ERROR_MESSAGES.text.mustBeString;
  if (!isNonEmptyString(value)) return ERROR_MESSAGES.text.required;
  if (value.length < min) return ERROR_MESSAGES.text.minLength(min);
  if (value.length > max) return ERROR_MESSAGES.text.maxLength(max);
  return null;
}

// Number validation
export function validateNumber(value: unknown, min?: number, max?: number): string | null {
  if (typeof value !== 'number') {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) return ERROR_MESSAGES.number.invalid;
      value = parsed;
    } else {
      return ERROR_MESSAGES.number.invalid;
    }
  }
  
  const numValue = value as number;
  if (min !== undefined && numValue < min) return ERROR_MESSAGES.number.min(min);
  if (max !== undefined && numValue > max) return ERROR_MESSAGES.number.max(max);
  return null;
}

// Component name validation (for custom components)
export function validateComponentName(value: unknown): string | null {
  if (!isString(value)) return ERROR_MESSAGES.componentName.mustBeString;
  if (!isNonEmptyString(value)) return ERROR_MESSAGES.componentName.required;
  if (!VALIDATION_REGEX.componentName.test(value)) return ERROR_MESSAGES.componentName.invalid;
  if (value.length < LENGTH_LIMITS.componentName.min) return ERROR_MESSAGES.componentName.minLength;
  if (value.length > LENGTH_LIMITS.componentName.max) return ERROR_MESSAGES.componentName.maxLength;
  return null;
}

// Generic validation function
export function validateField(
  value: unknown, 
  type: 'text' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'textarea',
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  } = {}
): string | null {
  // Check if required
  if (options.required && (!isString(value) || !isNonEmptyString(value))) {
    return ERROR_MESSAGES.required;
  }
  
  // If not required and empty, it's valid
  if (!options.required && (!isString(value) || !isNonEmptyString(value))) {
    return null;
  }
  
  // Type-specific validation
  switch (type) {
    case 'email':
      return validateEmail(value);
    case 'url':
      return validateUrl(value);
    case 'phone':
      return validatePhone(value);
    case 'date':
      return validateDate(value);
    case 'number':
      return validateNumber(value, options.min, options.max);
    case 'text':
    case 'textarea':
      return validateText(value, options.minLength, options.maxLength);
    default:
      return ERROR_MESSAGES.field.unknownType;
  }
}

// Validation for complete form data
export function validateFormData(
  data: Record<string, unknown>,
  schema: Record<string, {
    type: 'text' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'textarea';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const value = data[fieldName];
    const error = validateField(value, fieldSchema.type, fieldSchema);
    if (error) {
      errors[fieldName] = error;
    }
  }
  
  return errors;
}
