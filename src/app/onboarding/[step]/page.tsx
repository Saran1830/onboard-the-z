import React, { Suspense } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  const resolvedParams = await params;
  const stepNumber = Number(resolvedParams.step);
  
  // Preload the client component
  const OnboardingStepClient = (await import('./OnBoardingStepClient')).default;
  
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <OnboardingStepClient stepNumber={stepNumber} />
    </Suspense>
  );
}
