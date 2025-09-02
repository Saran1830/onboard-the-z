export interface UserData {
   id: string;
   email: string;
   created_at: string;
   updated_at: string;
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

export interface Address {
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly country: string;
}

export interface FormData {
  readonly email?: string;
  readonly aboutme?: string;
  readonly birthdate?: string;
  readonly address?: Address;
  [key: string]: unknown;
}

export interface ValidationRule {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly custom?: (value: unknown) => string | null;
}

export interface ValidationSchema {
  readonly [fieldName: string]: ValidationRule;
}

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

export interface OnboardingResult {
  readonly success: boolean;
  readonly error?: string;
  readonly data?: unknown;
}

