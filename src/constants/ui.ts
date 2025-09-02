/**
 * UI Constants and Theme
 * Centralized UI constants, styling values, and theme configuration
 */

import { APP_CONFIG } from '../config/app.config'

// Main UI constants from config
export const UI_CONSTANTS = APP_CONFIG.ui

// Glass morphism styles
export const GLASS_STYLES = {
  card: {
    background: UI_CONSTANTS.glass.background,
    backdropFilter: `blur(${UI_CONSTANTS.glass.backdropBlur})`,
    border: UI_CONSTANTS.glass.border,
    borderRadius: '24px',
    padding: UI_CONSTANTS.glass.padding,
    boxShadow: UI_CONSTANTS.glass.shadow
  },
  
  background: {
    background: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(18px)',
    width: '100vw',
    height: '100vh',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: -1
  }
}

// Form styling constants
export const FORM_STYLES = {
  maxWidth: UI_CONSTANTS.form.maxWidth,
  inputHeight: UI_CONSTANTS.form.inputHeight,
  
  input: {
    base: `
      w-full p-3 text-base rounded-lg border transition-all duration-200 outline-none
      backdrop-filter backdrop-blur-sm min-h-[${UI_CONSTANTS.form.inputHeight}] sm:text-base
      focus:transform focus:-translate-y-0.5 focus:shadow-lg
    `,
    
    normal: `
      border-gray-300 bg-white/60 hover:bg-white/80 
      focus:border-blue-500 focus:ring-2 focus:ring-blue-200
    `,
    
    error: `
      border-red-400 bg-red-50 
      focus:border-red-600 focus:ring-2 focus:ring-red-200
    `
  },
  
  button: {
    primary: `
      px-6 py-3 rounded-lg font-medium transition-all duration-200 
      backdrop-filter backdrop-blur-sm btn-primary
      hover:transform hover:-translate-y-0.5 hover:shadow-lg
    `,
    
    secondary: `
      px-6 py-3 rounded-lg font-medium transition-all duration-200 
      backdrop-filter backdrop-blur-sm
      bg-gray-200/80 text-gray-700 hover:bg-gray-300/90 
      hover:transform hover:-translate-y-0.5 hover:shadow-md
    `,
    
    disabled: `
      opacity-50 cursor-not-allowed transform-none
    `
  }
}

// Component size constants
export const COMPONENT_SIZES = {
  icon: {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6'
  },
  button: {
    small: 'px-3 py-1.5',
    medium: 'px-4 py-2', 
    large: 'px-6 py-3'
  },
  skeleton: {
    small: 'h-8 w-16',
    medium: 'h-12 w-20',
    large: 'h-16 w-24'
  },
  input: {
    checkbox: 'w-4 h-4'
  }
} as const;

// Layout spacing constants
export const LAYOUT_SPACING = {
  gap: {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    extraLarge: 'gap-8'
  },
  padding: {
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
    extraLarge: 'p-8'
  },
  grid: {
    responsive2Col: 'grid grid-cols-1 sm:grid-cols-2',
    responsiveRow: 'flex flex-col lg:flex-row'
  }
} as const;

// Color constants
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#0070f3',
    600: '#0061d5',
    700: '#0052cc'
  },
  
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626'
  },
  
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a'
  },
  
  blue: {
    50: '#eff6ff',
    500: '#0070f3',
    600: '#0061d5',
    700: '#0052cc'
  }
}

// Spacing constants
export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
  xxxl: '4rem'     // 64px
}

// Border radius constants
export const BORDER_RADIUS = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  xxl: '1.5rem',   // 24px
  full: '9999px'
}

// Breakpoint constants
export const BREAKPOINTS = {
  mobile: UI_CONSTANTS.breakpoints.mobile,
  tablet: UI_CONSTANTS.breakpoints.tablet, 
  desktop: UI_CONSTANTS.breakpoints.desktop
}

// Animation constants
export const ANIMATIONS = {
  transition: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms'
  },
  
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
  }
}

// Loading skeleton styles
export const SKELETON_STYLES = {
  input: 'h-10 bg-gray-200 rounded animate-pulse',
  text: 'h-4 bg-gray-200 rounded animate-pulse',
  button: 'h-12 bg-gray-200 rounded animate-pulse',
  avatar: 'w-10 h-10 bg-gray-200 rounded-full animate-pulse'
}

// Toast configuration
export const TOAST_CONFIG = {
  defaultDuration: UI_CONSTANTS.toast.defaultDuration,
  positions: {
    topRight: 'top-4 right-4',
    topLeft: 'top-4 left-4', 
    bottomRight: 'bottom-4 right-4',
    bottomLeft: 'bottom-4 left-4'
  }
}

// Placeholder constants for form fields
export const FORM_PLACEHOLDERS = {
  phone: '(555) 123-4567',
  url: 'https://example.com',
  email: 'user@example.com',
  zipCode: '10001',
  address: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  }
} as const;

// Input type constants
export const INPUT_TYPES = {
  TEXT: 'text' as const,
  EMAIL: 'email' as const,
  PASSWORD: 'password' as const,
  TEL: 'tel' as const,
  URL: 'url' as const,
  DATE: 'date' as const,
  TEXTAREA: 'textarea' as const,
  SELECT: 'select' as const
} as const;

// Import messages from config
export const MESSAGES = APP_CONFIG.onboarding.messages;

// Additional UI messages not in config
export const UI_MESSAGES = {
  validation: {
    required: 'This field is required',
    emailInvalid: 'Please enter a valid email address',
    phoneInvalid: 'Please enter a valid phone number',
    urlInvalid: 'Please enter a valid URL',
    passwordTooShort: 'Password must be at least 6 characters'
  },
  general: {
    loading: 'Loading...',
    saving: 'Saving...',
    error: 'Something went wrong. Please try again.',
    success: 'Operation completed successfully!'
  }
} as const;

// Page titles
export const PAGE_TITLES = {
  HOME: 'Board the Z - Welcome',
  ADMIN: 'Admin Dashboard', 
  DATA: 'Data Management',
  ONBOARDING: 'Complete Your Profile'
} as const;

export type InputType = typeof INPUT_TYPES[keyof typeof INPUT_TYPES];
