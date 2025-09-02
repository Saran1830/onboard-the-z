'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '../../../components/ui/GlassCard';
import GlassBackground from '../../../components/GlassBackground';
import { ROUTES } from '../../../constants/routes';
import { MESSAGES } from '../../../constants/ui';

export default function OnboardingSuccessPage() {
  const router = useRouter();

  const handleContinue = () => {
    // Redirect to main application or dashboard
    router.push(ROUTES.DASHBOARD);
  };

  const handleStartOver = () => {
    // Allow user to start onboarding again
    router.push(ROUTES.ONBOARDING.START);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <GlassBackground />
      <GlassCard style={{ width: '100%', maxWidth: '28rem' }}>
        <div className="text-center space-y-6">

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
                 {MESSAGES.success.title}
            </h1>
            <p className="text-lg text-gray-600">
              {MESSAGES.success.description}
            </p>
          </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {MESSAGES.buttons.continue}
              </button>
              
              <button
                onClick={handleStartOver}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                {MESSAGES.buttons.startOver}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }
