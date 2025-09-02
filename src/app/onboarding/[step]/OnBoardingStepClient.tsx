// app/onboarding/[step]/OnboardingStepClient.tsx
'use client';

import React from 'react';
import StepShell from '../../../components/Panels/StepShell';
import InlineError from './InlineError';
import FieldList from '../../../components/Panels/FieldList';
import FormNavigation from '../../../components/Navigation/FormNavigation';
import { useOnboardingData } from '../../../components/Hooks/onboarding/useOnboardingData';
import { useFormModel } from '../../../components/Hooks/onboarding/useFormModel';
import { useDynamicValidation } from '../../../components/Hooks/onboarding/useDynamicValidation';
import { useFormInitialization } from '../../../components/Hooks/onboarding/useFormInitialization';
import { submitOnboardingStep } from '../../../../server/actions/onboarding';
import { useRouter } from 'next/navigation';

export default function OnboardingStepClient({ stepNumber }: { stepNumber: number }) {
  const router = useRouter();
  const { loading, redirecting, userEmail, components, pageConfig, totalSteps, initialForm } =
    useOnboardingData(stepNumber);

  const {
    form, setForm, setField, clearError,
    addressErrorsFrom, formErrors, setFormErrors,
    submitting, setSubmitting,
  } = useFormModel();

  const { validateForm } = useDynamicValidation({ components, pageConfig });

  // Initialize form with proper address field handling
  useFormInitialization({
    initialForm,
    components,
    setForm
  });

  if (loading || redirecting || !userEmail || !pageConfig) {
    // Show loading skeleton instead of null for better UX
    return (
      <StepShell
        stepNumber={stepNumber}
        totalSteps={3}
        maxWidth="600px"
        title={`Step ${stepNumber}`}
      >
        <div className="space-y-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between mt-8">
            <div className="h-12 bg-gray-200 rounded w-20"></div>
            <div className="h-12 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </StepShell>
    );
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const errors = validateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const res = await submitOnboardingStep(String(stepNumber), { ...form, email: userEmail });
      if (!res?.success) {
        setFormErrors(prev => ({ ...prev, _form: res?.error || 'Failed to submit data' }));
        setSubmitting(false);
        return;
      }
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If this is the last step, redirect to success page
      if (stepNumber >= totalSteps) {
        router.push('/onboarding/success');
      } else {
        router.push(`/onboarding/${stepNumber + 1}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormErrors(prev => ({ ...prev, _form: 'Network or server error' }));
      setSubmitting(false);
    }
  };

  return (
    <StepShell
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      maxWidth="600px"
      header={
        <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Logged in as:</strong> {userEmail}
        </div>
      }
      title={
        stepNumber === 2 ? 'Tell us about yourself' :
        stepNumber === 3 ? 'Personal Details' :
        `Step ${stepNumber}`
      }
    >
      {/* Loading overlay when submitting */}
      {submitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span>Saving your progress...</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldList
          components={components}
          pageConfig={pageConfig}
          values={form}
          onChange={(name, value) => { setField(name, value); clearError(name); }}
          errorFor={(name) => formErrors[name]}
          addressErrors={addressErrorsFrom(formErrors)}
        />

        {formErrors._form && <InlineError message={formErrors._form} />}

        <FormNavigation
          currentStep={stepNumber}
          totalSteps={totalSteps}
          canGoBack={stepNumber > 1 && !submitting}
          canGoNext={!submitting}
          isSubmitting={submitting}
          nextButtonText={stepNumber >= totalSteps ? 'Complete Onboarding' : undefined}
          hideStepIndicator={true}
          className="mt-8"
        />
      </form>
    </StepShell>
  );
}
