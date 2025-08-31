// Type guards for runtime validation
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isStringArray(value: unknown): value is string[] {
  return isArray(value) && value.every(isString);
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

export function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

export function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isValidDateString(value: unknown): value is string {
  if (!isString(value)) return false;
  const date = new Date(value);
  return isDate(date);
}

// Component type specific guards
export function isComponentType(value: unknown): value is "text" | "textarea" | "date" | "number" | "email" | "phone" | "url" {
  const validTypes = ["text", "textarea", "date", "number", "email", "phone", "url"];
  return isString(value) && validTypes.includes(value);
}

// Define interfaces locally to avoid import issues
export interface Address {
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly country: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  profile_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  users?: {
    email: string;
  };
}

export interface UserProfileFlat extends UserProfile {
  readonly email: string;
}

export interface CustomComponent {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "number" | "email" | "phone" | "url";
  required: boolean;
  placeholder: string;
  created_at: string;
  options: string[] | null;
}

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

// User Profile guards
export function isUserProfile(value: unknown): value is UserProfile {
  if (!isObject(value)) return false;
  
  const profile = value as Record<string, unknown>;
  return (
    isString(profile.id) &&
    isString(profile.user_id) &&
    isObject(profile.profile_data) &&
    isString(profile.created_at) &&
    isString(profile.updated_at)
  );
}

export function isUserProfileFlat(value: unknown): value is UserProfileFlat {
  if (!isUserProfile(value)) return false;
  
  const profile = value as unknown as Record<string, unknown>;
  return isString(profile.email);
}

// Address guard
export function isAddress(value: unknown): value is Address {
  if (!isObject(value)) return false;
  
  const address = value as Record<string, unknown>;
  return (
    isString(address.street) &&
    isString(address.city) &&
    isString(address.state) &&
    isString(address.zipCode) &&
    isString(address.country)
  );
}

// Custom Component guard
export function isCustomComponent(value: unknown): value is CustomComponent {
  if (!isObject(value)) return false;
  
  const component = value as Record<string, unknown>;
  return (
    isString(component.id) &&
    isString(component.name) &&
    isString(component.label) &&
    isComponentType(component.type) &&
    isBoolean(component.required) &&
    isString(component.placeholder) &&
    isString(component.created_at) &&
    (isNullOrUndefined(component.options) || isStringArray(component.options))
  );
}

// API Response guard
export function isApiResponse<T>(value: unknown, dataGuard?: (data: unknown) => data is T): value is ApiResponse<T> {
  if (!isObject(value)) return false;
  
  const response = value as Record<string, unknown>;
  const hasValidStructure = (
    isBoolean(response.success) &&
    (isNullOrUndefined(response.error) || isString(response.error))
  );
  
  if (!hasValidStructure) return false;
  
  if (dataGuard && response.data !== undefined) {
    return dataGuard(response.data);
  }
  
  return true;
}
