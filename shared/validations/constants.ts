/**
 * Validation Constants
 * Centralized constants for validation patterns, limits, and messages
 */

// Regular expressions for validation
export const VALIDATION_REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\(\)\-\+\.]{10,}$/,
  componentName: /^[a-z_]+$/,
  url: /^https?:\/\/.+/,
  zipCode: /^\d{5}(-\d{4})?$/,
  scriptTag: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  htmlChars: /[<>'"&]/g,
  phoneChars: /[^0-9+()-.\s]/g,
  emailChars: /[^a-z0-9@._-]/g,
  numberChars: /[^0-9.-]/g,
  componentNameChars: /[^a-z0-9_]/g,
  multipleUnderscores: /_{2,}/g,
  leadingTrailingUnderscores: /^_|_$/g
} as const;

// Length limits
export const LENGTH_LIMITS = {
  text: {
    min: 1,
    max: 1000,
    default: 255
  },
  componentName: {
    min: 2,
    max: 50
  },
  password: {
    min: 8,
    max: 128
  },
  phone: {
    min: 10,
    max: 15
  },
  textarea: {
    min: 1,
    max: 5000
  }
} as const;

// Numeric limits
export const NUMERIC_LIMITS = {
  age: {
    min: 0,
    max: 150
  },
  date: {
    minYear: 1900,
    maxYear: new Date().getFullYear()
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  required: "This field is required",
  email: {
    invalid: "Please enter a valid email address",
    required: "Email is required",
    mustBeString: "Email must be a string"
  },
  url: {
    invalid: "Please enter a valid URL",
    required: "URL is required",
    mustBeString: "URL must be a string"
  },
  phone: {
    invalid: "Please enter a valid phone number",
    required: "Phone number is required",
    mustBeString: "Phone number must be a string"
  },
  date: {
    invalid: "Please enter a valid date",
    required: "Date is required",
    mustBeString: "Date must be a string",
    future: "Date cannot be in the future"
  },
  text: {
    mustBeString: "Text must be a string",
    required: "This field is required",
    minLength: (min: number) => `Text must be at least ${min} characters`,
    maxLength: (max: number) => `Text must be no more than ${max} characters`
  },
  number: {
    invalid: "Please enter a valid number",
    min: (min: number) => `Number must be at least ${min}`,
    max: (max: number) => `Number must be no more than ${max}`
  },
  componentName: {
    mustBeString: "Component name must be a string",
    required: "Component name is required",
    invalid: "Component name must contain only lowercase letters and underscores",
    minLength: `Component name must be at least ${LENGTH_LIMITS.componentName.min} characters`,
    maxLength: `Component name must be no more than ${LENGTH_LIMITS.componentName.max} characters`
  },
  field: {
    unknownType: "Unknown field type"
  }
} as const;

// HTML character escape map
export const HTML_ESCAPE_MAP = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '&': '&amp;'
} as const;

// Protocol prefixes
export const URL_PROTOCOLS = {
  default: 'https://',
  http: 'http://',
  https: 'https://'
} as const;

// Field types
export const FIELD_TYPES = [
  'text',
  'email', 
  'url',
  'phone',
  'date',
  'number',
  'textarea'
] as const;

export type FieldType = typeof FIELD_TYPES[number];

// Component types
export const COMPONENT_TYPES = [
  'text',
  'textarea',
  'date',
  'number',
  'email',
  'phone',
  'url'
] as const;

export type ComponentType = typeof COMPONENT_TYPES[number];
