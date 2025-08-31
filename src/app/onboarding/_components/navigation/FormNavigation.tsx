import React from 'react';
import { useRouter } from 'next/navigation';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
  canGoBack?: boolean;
  canGoNext?: boolean;
  nextButtonText?: string;
  className?: string;
  hideStepIndicator?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isSubmitting = false,
  canGoBack = true,
  canGoNext = true,
  nextButtonText,
  className = "",
  hideStepIndicator = false
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      router.push(`/onboarding/${currentStep - 1}`);
    }
  };

  const getNextButtonText = () => {
    if (nextButtonText) return nextButtonText;
    if (isSubmitting) return 'Saving...';
    if (currentStep >= totalSteps) return 'Finish';
    return 'Next';
  };

  return (
    <div className={`form-navigation flex justify-between items-center mt-8 ${className}`}>
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        disabled={!canGoBack || currentStep <= 1}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center
          backdrop-filter backdrop-blur-sm
          ${(!canGoBack || currentStep <= 1)
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' 
            : 'bg-gray-200/80 text-gray-700 hover:bg-gray-300/90 hover:transform hover:-translate-y-0.5 hover:shadow-md active:bg-gray-400/80'
          }
        `}
        aria-label="Go to previous step"
      >
        <span className="mr-1">←</span> Back
      </button>

      {/* Step Indicator */}
      {!hideStepIndicator && (
        <div className="step-indicator">
          {Array.from({ length: totalSteps }, (_, index) => {
            const step = index + 1;
            return (
              <div
                key={step}
                className={`step-dot ${
                  step === currentStep
                    ? 'active' 
                    : step < currentStep
                      ? 'completed'
                      : 'pending'
                }`}
                aria-label={`Step ${step}${step === currentStep ? ' (current)' : step < currentStep ? ' (completed)' : ''}`}
              >
                {step < currentStep ? '✓' : step}
              </div>
            );
          })}
        </div>
      )}

      {/* Next Button */}
      <button
        type="submit"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center
          backdrop-filter backdrop-blur-sm btn-primary
          ${(!canGoNext || isSubmitting)
            ? 'opacity-50 cursor-not-allowed transform-none' 
            : 'hover:transform hover:-translate-y-0.5 hover:shadow-lg'
          }
        `}
        aria-label={currentStep >= totalSteps ? 'Finish onboarding' : 'Go to next step'}
      >
        {isSubmitting && (
          <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        {getNextButtonText()}
        {!isSubmitting && currentStep < totalSteps && <span className="ml-1">→</span>}
      </button>
    </div>
  );
};

export default FormNavigation;