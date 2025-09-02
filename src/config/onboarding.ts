// Create a centralized configuration file
// src/config/onboarding.ts

import { STEP_NUMBERS, STEP_CONFIG } from '../constants/routes'
import { CACHE_DURATIONS } from '../constants/timing'

export interface OnboardingStep {
  id: number
  route: string
  title: string
  isRequired: boolean
  allowsCustomComponents: boolean
}

export interface OnboardingConfig {
  steps: OnboardingStep[]
  totalSteps: number
  firstStep: number
  lastStep: number
  routes: {
    start: string
    success: string
    dataPage: string
    authRedirect: string
  }
  validation: {
    stepRange: { min: number; max: number }
    requiredComponentPages: number[]
  }
  cache: {
    duration: number
  }
  specialComponents: {
    address: string
    aboutMe: string
    birthdate: string
  }
  messages: {
    success: {
      title: string
      description: string
    }
    buttons: {
      continue: string
      startOver: string
      next: string
      finish: string
      complete: string
      saving: string
    }
  }
}

export const ONBOARDING_CONFIG: OnboardingConfig = {
  steps: [
    { 
      id: STEP_NUMBERS.first, 
      route: `/onboarding/${STEP_NUMBERS.first}`, 
      title: 'Authentication', 
      isRequired: true, 
      allowsCustomComponents: false 
    },
    { 
      id: STEP_NUMBERS.second, 
      route: `/onboarding/${STEP_NUMBERS.second}`, 
      title: 'Tell us about yourself', 
      isRequired: true, 
      allowsCustomComponents: true 
    },
    { 
      id: STEP_NUMBERS.third, 
      route: `/onboarding/${STEP_NUMBERS.third}`, 
      title: 'Personal Details', 
      isRequired: true, 
      allowsCustomComponents: true 
    },
  ],
  
  get totalSteps() { return this.steps.length },
  get firstStep() { return Math.min(...this.steps.map(s => s.id)) },
  get lastStep() { return Math.max(...this.steps.map(s => s.id)) },
  
  routes: {
    start: `/onboarding/${STEP_NUMBERS.first}`,
    success: '/onboarding/success',
    dataPage: '/data',
    authRedirect: `/onboarding/${STEP_NUMBERS.second}`,
  },
  
  validation: {
    stepRange: { min: STEP_CONFIG.min, max: STEP_CONFIG.max },
    get requiredComponentPages() { 
      return ONBOARDING_CONFIG.steps
        .filter(s => s.allowsCustomComponents && s.isRequired)
        .map(s => s.id)
    }
  },
  
  cache: {
    duration: CACHE_DURATIONS.medium,
  },
  
  specialComponents: {
    address: 'address',
    aboutMe: 'aboutMe', 
    birthdate: 'birthdate',
  },
  
  messages: {
    success: {
      title: 'Welcome Aboard!',
      description: 'Your onboarding has been completed successfully!',
    },
    buttons: {
      continue: 'Continue to Data',
      startOver: 'Start Onboarding Again',
      next: 'Next',
      finish: 'Finish',
      complete: 'Complete Onboarding',
      saving: 'Saving...',
    }
  }
}

// Helper functions
export const getStepById = (id: number): OnboardingStep | undefined => 
  ONBOARDING_CONFIG.steps.find(step => step.id === id)

export const getStepTitle = (stepNumber: number): string => 
  getStepById(stepNumber)?.title || `Step ${stepNumber}`

export const getNextStepRoute = (currentStep: number): string | null => {
  const nextStep = currentStep + 1
  return nextStep <= ONBOARDING_CONFIG.lastStep 
    ? `/onboarding/${nextStep}` 
    : ONBOARDING_CONFIG.routes.success
}

export const getPreviousStepRoute = (currentStep: number): string | null => 
  currentStep > ONBOARDING_CONFIG.firstStep 
    ? `/onboarding/${currentStep - 1}` 
    : null

export const isValidStep = (step: number): boolean => 
  step >= ONBOARDING_CONFIG.validation.stepRange.min && 
  step <= ONBOARDING_CONFIG.validation.stepRange.max

export const requiresComponents = (page: number): boolean => 
  ONBOARDING_CONFIG.validation.requiredComponentPages.includes(page)
