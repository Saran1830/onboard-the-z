import { isString, isNonEmptyString } from './typeGuards';

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmail(value: unknown): string | null {
  if (!isString(value)) return "Email must be a string";
  if (!isNonEmptyString(value)) return "Email is required";
  if (!isValidEmail(value)) return "Please enter a valid email address";
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
  if (!isString(value)) return "URL must be a string";
  if (!isNonEmptyString(value)) return "URL is required";
  if (!isValidUrl(value)) return "Please enter a valid URL";
  return null;
}

// Phone validation
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\(\)\-\+\.]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validatePhone(value: unknown): string | null {
  if (!isString(value)) return "Phone number must be a string";
  if (!isNonEmptyString(value)) return "Phone number is required";
  if (!isValidPhone(value)) return "Please enter a valid phone number";
  return null;
}

// Date validation
export function isValidDateString(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.getTime() > 0;
}

export function validateDate(value: unknown): string | null {
  if (!isString(value)) return "Date must be a string";
  if (!isNonEmptyString(value)) return "Date is required";
  if (!isValidDateString(value)) return "Please enter a valid date";
  
  const date = new Date(value);
  const now = new Date();
  if (date > now) return "Date cannot be in the future";
  
  return null;
}

// Text validation
export function validateText(value: unknown, minLength = 1, maxLength = 1000): string | null {
  if (!isString(value)) return "Text must be a string";
  if (!isNonEmptyString(value)) return "This field is required";
  if (value.length < minLength) return `Text must be at least ${minLength} characters`;
  if (value.length > maxLength) return `Text must be no more than ${maxLength} characters`;
  return null;
}

// Number validation
export function validateNumber(value: unknown, min?: number, max?: number): string | null {
  if (typeof value !== 'number') {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) return "Please enter a valid number";
      value = parsed;
    } else {
      return "Please enter a valid number";
    }
  }
  
  const numValue = value as number;
  if (min !== undefined && numValue < min) return `Number must be at least ${min}`;
  if (max !== undefined && numValue > max) return `Number must be no more than ${max}`;
  return null;
}

// Component name validation (for custom components)
export function validateComponentName(value: unknown): string | null {
  if (!isString(value)) return "Component name must be a string";
  if (!isNonEmptyString(value)) return "Component name is required";
  if (!/^[a-z_]+$/.test(value)) return "Component name must contain only lowercase letters and underscores";
  if (value.length < 2) return "Component name must be at least 2 characters";
  if (value.length > 50) return "Component name must be no more than 50 characters";
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
    return "This field is required";
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
      return "Unknown field type";
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
