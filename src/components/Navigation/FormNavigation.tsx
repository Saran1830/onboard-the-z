import React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';
import { MESSAGES } from '../../constants/ui';
import { Button } from '../ui/Button';

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
      router.push(ROUTES.ONBOARDING.STEP(currentStep - 1));
    }
  };

  const getNextButtonText = () => {
    if (nextButtonText) return nextButtonText;
    if (isSubmitting) return MESSAGES.buttons.saving;
    if (currentStep >= totalSteps) return MESSAGES.buttons.finish;
    return MESSAGES.buttons.next;
  };

  return (
    <div className={`form-navigation flex justify-between items-center mt-8 ${className}`}>
      {/* Back Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={handleBack}
        disabled={!canGoBack || currentStep <= 1}
        aria-label="Go to previous step"
      >
        <span className="mr-1">←</span> {MESSAGES.buttons.back}
      </Button>

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
      <Button
        type="submit"
        variant="primary"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        loading={isSubmitting}
        aria-label={currentStep >= totalSteps ? 'Finish onboarding' : 'Go to next step'}
      >
        {getNextButtonText()}
        {!isSubmitting && currentStep < totalSteps && <span className="ml-1">→</span>}
      </Button>
    </div>
  );
};

export default FormNavigation;