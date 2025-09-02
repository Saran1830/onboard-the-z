/**
 * Application Configuration
 * Single source of truth for all app constants and configuration
 */

export interface OnboardingStepConfig {
  id: number
  route: string
  title: string
  isRequired: boolean
  allowsCustomComponents: boolean
}

export interface ValidationConfig {
  stepRange: { min: number; max: number }
  requiredComponentPages: number[]
  textLimits: { min: number; max: number }
  componentNameLimits: { min: number; max: number }
  patterns: {
    email: RegExp
    phone: RegExp
    zipCode: RegExp
    componentName: RegExp
    url: RegExp
  }
}

export interface UIConfig {
  form: {
    maxWidth: string
    inputHeight: string
  }
  glass: {
    background: string
    backdropBlur: string
    border: string
    padding: string
    shadow: string
  }
  toast: {
    defaultDuration: number
  }
  breakpoints: {
    mobile: string
    tablet: string
    desktop: string
  }
}

export interface MessagesConfig {
  success: {
    title: string
    description: string
  }
  auth: {
    signUpTitle: string
    signUpSubtitle: string
    signInTitle: string
    signInSubtitle: string
    signUpButton: string
    signInButton: string
    toggleToSignIn: string
    toggleToSignUp: string
  }
  buttons: {
    continue: string
    startOver: string
    next: string
    finish: string
    complete: string
    saving: string
    back: string
  }
  errors: {
    networkError: string
    validationError: string
    submitError: string
    loadingError: string
  }
}

export interface ComponentsConfig {
  builtIn: string[]
  special: {
    address: {
      name: string
      requiredFields: string[]
    }
  }
}

export interface AppConfig {
  onboarding: {
    steps: OnboardingStepConfig[]
    validation: ValidationConfig
    routes: {
      start: string
      success: string
      dataPage: string
      authRedirect: string
    }
    messages: MessagesConfig
    cache: {
      duration: number
    }
  }
  ui: UIConfig
  components: ComponentsConfig
}

// Main configuration object
export const APP_CONFIG: AppConfig = {
  onboarding: {
    steps: [
      { 
        id: 1, 
        route: '/onboarding/1', 
        title: 'Authentication', 
        isRequired: true, 
        allowsCustomComponents: false 
      },
      { 
        id: 2, 
        route: '/onboarding/2', 
        title: 'Tell us about yourself', 
        isRequired: true, 
        allowsCustomComponents: true 
      },
      { 
        id: 3, 
        route: '/onboarding/3', 
        title: 'Personal Details', 
        isRequired: true, 
        allowsCustomComponents: true 
      },
    ],
    
    validation: {
      stepRange: { min: 1, max: 3 },
      requiredComponentPages: [2, 3],
      textLimits: { min: 1, max: 1000 },
      componentNameLimits: { min: 2, max: 50 },
      patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\(\)\-\+\.]{10,}$/,
        zipCode: /^\d{5}(-\d{4})?$/,
        componentName: /^[a-z_]+$/,
        url: /^https?:\/\/.+/
      }
    },
    
    routes: {
      start: '/onboarding/1',
      success: '/onboarding/success',
      dataPage: '/data',
      authRedirect: '/onboarding/2',
    },
    
    messages: {
      success: {
        title: 'Welcome Aboard!',
        description: 'Your onboarding has been completed successfully!',
      },
      auth: {
        signUpTitle: 'Create Account',
        signUpSubtitle: 'Sign up to start your onboarding journey',
        signInTitle: 'Welcome Back',
        signInSubtitle: 'Sign in to continue your onboarding',
        signUpButton: 'Sign Up',
        signInButton: 'Sign In',
        toggleToSignIn: 'Already have an account? Sign In',
        toggleToSignUp: 'New user? Sign Up'
      },
      buttons: {
        continue: 'Continue to Data',
        startOver: 'Start Onboarding Again',
        next: 'Next',
        finish: 'Finish',
        complete: 'Complete Onboarding',
        saving: 'Saving...',
        back: 'Back'
      },
      errors: {
        networkError: 'Network or server error',
        validationError: 'Please check your input and try again',
        submitError: 'Failed to submit data',
        loadingError: 'Failed to load data'
      }
    },
    
    cache: {
      duration: 10000, // 10 seconds
    }
  },
  
  ui: {
    form: {
      maxWidth: '600px',
      inputHeight: '48px'
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropBlur: '16px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      padding: '32px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
    },
    toast: {
      defaultDuration: 3000
    },
    breakpoints: {
      mobile: '600px',
      tablet: '768px',
      desktop: '1024px'
    }
  },
  
  components: {
    builtIn: ['aboutMe', 'birthdate', 'address'],
    special: {
      address: {
        name: 'address',
        requiredFields: ['street', 'city', 'state', 'zipCode', 'country']
      }
    }
  }
}

// Computed properties for easier access
export const ONBOARDING_STEPS = APP_CONFIG.onboarding.steps
export const TOTAL_STEPS = ONBOARDING_STEPS.length
export const FIRST_STEP = Math.min(...ONBOARDING_STEPS.map(s => s.id))
export const LAST_STEP = Math.max(...ONBOARDING_STEPS.map(s => s.id))
export const VALIDATION_PATTERNS = APP_CONFIG.onboarding.validation.patterns
export const UI_CONSTANTS = APP_CONFIG.ui
export const ROUTES = APP_CONFIG.onboarding.routes
export const MESSAGES = APP_CONFIG.onboarding.messages
