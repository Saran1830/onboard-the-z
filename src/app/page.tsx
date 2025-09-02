/**
 * Home page component for Board the Z application
 * Automatically redirects users to the first onboarding step
 * 
 * This serves as the application's entry point and immediately routes
 * users to begin the onboarding process. This design decision ensures
 * users always start with a guided experience.
 * 
 * @component HomePage
 * @author Board the Z Team
 * @version 1.0.0
 */

import { redirect } from 'next/navigation';
import { ROUTES } from '../constants/routes';

/**
 * Home page component that redirects to onboarding
 * 
 * This component doesn't render any UI content as it immediately
 * redirects users to the onboarding flow. The redirect is server-side
 * and happens before any client-side rendering.
 * 
 * @returns Never returns JSX - triggers server-side redirect
 * 
 * @example
 * When users visit the root URL (/), they are automatically
 * redirected to /onboarding/1 to begin the onboarding process.
 */
export default function Page() {
  // Redirect directly to onboarding step 1
  // This ensures all users start with the guided onboarding experience
  redirect(ROUTES.ONBOARDING.START);
}
