import { validateField, validateFormData, validateComponentName, isValidEmail } from './validators';
import { sanitizeField, sanitizeFormData, sanitizeComponentName } from './sanitizers';
import { 
  isUserProfile, 
  isApiResponse
} from './typeGuards';

// Combined validation and sanitization for single field
export function processField(
  value: unknown,
  type: 'text' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'textarea',
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  } = {}
): { value: unknown; error: string | null } {
  // First sanitize
  const sanitizedValue = sanitizeField(value, type);
  
  // Then validate
  const error = validateField(sanitizedValue, type, options);
  
  return {
    value: sanitizedValue,
    error
  };
}

// Process entire form
export function processFormData(
  data: Record<string, unknown>,
  schema: Record<string, {
    type: 'text' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'textarea';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }>
): {
  sanitizedData: Record<string, unknown>;
  errors: Record<string, string>;
  isValid: boolean;
} {
  // Sanitize first
  const sanitizedData = sanitizeFormData(data, schema);
  
  // Then validate
  const errors = validateFormData(sanitizedData, schema);
  
  return {
    sanitizedData,
    errors,
    isValid: Object.keys(errors).length === 0
  };
}

// Validate API responses safely
export function safeApiCall<T>(
  response: unknown,
  dataValidator?: (data: unknown) => data is T
): { success: boolean; data?: T; error?: string } {
  if (!isApiResponse(response, dataValidator)) {
    return {
      success: false,
      error: 'Invalid API response format'
    };
  }
  
  return response as { success: boolean; data?: T; error?: string };
}

// Validate and sanitize component creation data
export function processComponentData(data: unknown): {
  isValid: boolean;
  sanitizedData?: {
    name: string;
    label: string;
    type: 'text' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'textarea';
    required: boolean;
    placeholder: string;
    options: string[] | null;
  };
  errors?: Record<string, string>;
} {
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: { general: 'Invalid component data' }
    };
  }
  
  const input = data as Record<string, unknown>;
  const errors: Record<string, string> = {};
  
  // Validate and sanitize name
  const nameError = validateComponentName(input.name);
  if (nameError) {
    errors.name = nameError;
  }
  const sanitizedName = sanitizeComponentName(input.name);
  
  // Validate other fields
  const labelError = validateField(input.label, 'text', { required: true, maxLength: 100 });
  if (labelError) errors.label = labelError;
  
  const placeholderError = validateField(input.placeholder, 'text', { maxLength: 200 });
  if (placeholderError) errors.placeholder = placeholderError;
  
  // Validate type
  const validTypes = ['text', 'email', 'url', 'phone', 'date', 'number', 'textarea'];
  if (!validTypes.includes(input.type as string)) {
    errors.type = 'Invalid component type';
  }
  
  // Validate required boolean
  if (typeof input.required !== 'boolean') {
    errors.required = 'Required field must be boolean';
  }
  
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }
  
  return {
    isValid: true,
    sanitizedData: {
      name: sanitizedName,
      label: String(input.label).trim(),
      type: input.type as 'text' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'textarea',
      required: Boolean(input.required),
      placeholder: String(input.placeholder || '').trim(),
      options: Array.isArray(input.options) ? input.options.filter(opt => typeof opt === 'string') : null
    }
  };
}

// Utility to check if user profile data is valid
export function validateUserProfileData(data: unknown): {
  isValid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];
  
  if (!isUserProfile(data)) {
    errors.push('Invalid user profile format');
  } else {
    // Check profile_data structure
    if (!data.profile_data || typeof data.profile_data !== 'object') {
      errors.push('Invalid profile data structure');
    }
    
    // Validate email if present
    if (data.users?.email && !isValidEmail(data.users.email)) {
      errors.push('Invalid email format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

// Export specific functions to avoid conflicts
export {
  // Type guards
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isStringArray,
  isNullOrUndefined,
  isNonEmptyString,
  isPositiveNumber,
  isInteger,
  isDate,
  isComponentType,
  isUserProfile,
  isUserProfileFlat,
  isAddress,
  isCustomComponent,
  isApiResponse
} from './typeGuards';

export {
  // Validators
  isValidEmail,
  isValidUrl,
  isValidPhone,
  validateEmail,
  validateUrl,
  validatePhone,
  validateDate,
  validateText,
  validateNumber,
  validateComponentName,
  validateField,
  validateFormData
} from './validators';

export {
  // Sanitizers
  sanitizeString,
  sanitizeEmail,
  sanitizeNumber,
  sanitizePhone,
  sanitizeUrl,
  sanitizeComponentName,
  sanitizeField,
  sanitizeFormData,
  deepSanitizeObject
} from './sanitizers';
