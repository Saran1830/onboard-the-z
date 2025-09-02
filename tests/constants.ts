/**
 * Test Constants
 * Centralized constants for test data and mock values
 */

// Test dates
export const TEST_DATES = {
  valid: {
    birthdate: '1990-05-15',
    recent: '2023-05-15',
    christmas: '1990-12-25',
    isoFormat: '2023-05-15T10:00:00Z'
  },
  invalid: {
    empty: '',
    malformed: 'invalid-date',
    future: '2030-01-01'
  }
} as const;

// Test step numbers
export const TEST_STEPS = {
  first: 1,
  second: 2,
  third: 3,
  invalid: {
    zero: 0,
    negative: -1,
    outOfRange: 4,
    nonNumeric: 'invalid'
  }
} as const;

// Test user data
export const TEST_USER_DATA = {
  valid: {
    email: 'test@example.com',
    phone: '+1-555-123-4567',
    name: 'John Doe',
    aboutme: 'I am a developer',
    website: 'https://example.com'
  },
  invalid: {
    email: 'invalid-email',
    phone: '123',
    name: '',
    website: 'not-a-url'
  }
} as const;

// Test address data
export const TEST_ADDRESS_DATA = {
  valid: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  },
  invalid: {
    zipCode: 'invalid'
  }
} as const;

// Test component data
export const TEST_COMPONENT_DATA = {
  valid: {
    name: 'test_component',
    label: 'Test Component',
    type: 'text' as const,
    placeholder: 'Enter text here'
  },
  invalid: {
    name: 'Invalid-Name!',
    type: 'invalid_type'
  }
} as const;

// Test numbers and limits
export const TEST_NUMBERS = {
  positive: 123,
  negative: -123,
  decimal: 123.45,
  zero: 0,
  min: 1,
  max: 1000
} as const;

// Test timeouts and durations
export const TEST_TIMEOUTS = {
  short: 100,
  medium: 1000,
  long: 5000,
  toast: 3000
} as const;

// Test pagination
export const TEST_PAGINATION = {
  firstPage: 1,
  secondPage: 2,
  defaultPageSize: 10,
  largePageSize: 100
} as const;

// Test form field lengths
export const TEST_FIELD_LENGTHS = {
  short: 'Hi',
  normal: 'This is a normal length text',
  long: 'A'.repeat(50),
  tooLong: 'A'.repeat(1001)
} as const;

// Mock local storage keys
export const TEST_STORAGE_KEYS = {
  testKey: 'test-key',
  userKey: 'user',
  formData: 'form-data'
} as const;

// Test error messages
export const TEST_ERROR_MESSAGES = {
  networkError: 'Network error occurred',
  validationError: 'Validation failed',
  notFound: 'Resource not found',
  unauthorized: 'Unauthorized access'
} as const;
