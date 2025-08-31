import { isString, isNumber } from './typeGuards';

// String sanitization
export function sanitizeString(input: unknown): string {
  if (!isString(input)) return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>'"&]/g, (char) => { // Escape HTML characters
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return char;
      }
    });
}

// Email sanitization
export function sanitizeEmail(input: unknown): string {
  const sanitized = sanitizeString(input).toLowerCase();
  return sanitized.replace(/[^a-z0-9@._-]/g, '');
}

// Number sanitization
export function sanitizeNumber(input: unknown): number | null {
  if (isNumber(input)) return input;
  if (isString(input)) {
    const parsed = parseFloat(input.replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

// Phone sanitization
export function sanitizePhone(input: unknown): string {
  if (!isString(input)) return '';
  return input.replace(/[^0-9+()-.\s]/g, '');
}

// URL sanitization
export function sanitizeUrl(input: unknown): string {
  if (!isString(input)) return '';
  const sanitized = input.trim();
  
  // Add protocol if missing
  if (sanitized && !sanitized.match(/^https?:\/\//)) {
    return `https://${sanitized}`;
  }
  
  return sanitized;
}

// Component name sanitization (for database storage)
export function sanitizeComponentName(input: unknown): string {
  if (!isString(input)) return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}

// Generic field sanitization based on type
export function sanitizeField(
  value: unknown, 
  type: 'text' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'textarea'
): unknown {
  switch (type) {
    case 'email':
      return sanitizeEmail(value);
    case 'url':
      return sanitizeUrl(value);
    case 'phone':
      return sanitizePhone(value);
    case 'number':
      return sanitizeNumber(value);
    case 'date':
      return isString(value) ? value.trim() : '';
    case 'text':
    case 'textarea':
      return sanitizeString(value);
    default:
      return sanitizeString(value);
  }
}

// Sanitize an entire form data object
export function sanitizeFormData(
  data: Record<string, unknown>,
  schema: Record<string, { type: 'text' | 'email' | 'url' | 'phone' | 'date' | 'number' | 'textarea' }>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [fieldName, value] of Object.entries(data)) {
    const fieldSchema = schema[fieldName];
    if (fieldSchema) {
      sanitized[fieldName] = sanitizeField(value, fieldSchema.type);
    } else {
      // Default to string sanitization for unknown fields
      sanitized[fieldName] = sanitizeString(value);
    }
  }
  
  return sanitized;
}

// Deep sanitize object (handles nested objects)
export function deepSanitizeObject(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(deepSanitizeObject);
  }
  
  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[sanitizeString(key)] = deepSanitizeObject(value);
    }
    return sanitized;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  return obj;
}
