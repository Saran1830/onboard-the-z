// app/onboarding/[step]/OnboardingStepClient.tsx
'use client';

import React from 'react';
import StepShell from '../_components/StepShell';
import InlineError from '../_components/InlineError';
import FieldList from '../_components/FieldList';
import FormNavigation from '../_components/navigation/FormNavigation';
import { useOnboardingData } from '../_hooks/useOnboardingData';
import { useFormModel } from '../_hooks/useFormModel';
import { useDynamicValidation } from '../_hooks/useDynamicValidation';
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

  // Apply prefill once when it arrives (no loading screen shown)
  React.useEffect(() => {
    if (initialForm) {
      // Merge DB values first so any user-edited fields win if already typed
      setForm(prev => ({ ...initialForm, ...prev }));
    }
  }, [initialForm, setForm]);

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
      
      // If this is the last step, redirect to success page
      if (stepNumber >= totalSteps) {
        router.push('/onboarding/success');
      } else {
        router.push(`/onboarding/${stepNumber + 1}`);
      }
    } catch {
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
          canGoBack={stepNumber > 1}
          canGoNext={!submitting}
          nextButtonText={stepNumber >= totalSteps ? 'Complete Onboarding' : undefined}
          hideStepIndicator={true}
          className="mt-8"
        />
      </form>
    </StepShell>
  );
}
