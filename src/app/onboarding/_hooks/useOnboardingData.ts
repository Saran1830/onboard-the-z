// hooks/onboarding/useOnboardingData.ts
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../../../server/actions/auth';
import { getCustomComponents, getPageConfigs } from '../../../../server/actions/admin';
import { getUserProfile } from '../../../../server/actions/onboarding';  // ← fetch saved profile
import type { CustomComponent, PageConfig } from '../../../types/components';

// Cache for static data that doesn't change often
const cache = {
  components: null as CustomComponent[] | null,
  pageConfigs: null as PageConfig[] | null,
  timestamp: 0
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useOnboardingData(stepNumber: number) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [components, setComponents] = useState<CustomComponent[]>([]);
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [initialForm, setInitialForm] = useState<Record<string, unknown> | null>(null);
  const totalSteps = 3;

  // Memoize expensive operations
  const getCurrentPageConfig = useCallback((configs: PageConfig[], step: number) => {
    return configs.find((c: PageConfig) => c.page === step) || null;
  }, []);

  const shouldUseCache = useMemo(() => {
    const now = Date.now();
    return cache.components && cache.pageConfigs && (now - cache.timestamp) < CACHE_DURATION;
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!mounted) return;

        if (!currentUser?.email) {
          setRedirecting(true);
          router.replace('/onboarding/1');
          return;
        }
        setUserEmail(currentUser.email);

        let cc: CustomComponent[];
        let pc: PageConfig[];

        // Use cache if available and fresh
        if (shouldUseCache) {
          cc = cache.components!;
          pc = cache.pageConfigs!;
        } else {
          // Fetch fresh data and update cache
          [cc, pc] = await Promise.all([
            getCustomComponents(),
            getPageConfigs(),
          ]);
          cache.components = cc;
          cache.pageConfigs = pc;
          cache.timestamp = Date.now();
        }

        // Fetch user profile separately (always fresh)
        const profileRes = await getUserProfile(currentUser.email);

        if (!mounted) return;

        setComponents(cc);
        const cfg = getCurrentPageConfig(pc, stepNumber);

        // auto-skip unconfigured steps silently
        if (!cfg || !cfg.components?.length) {
          setRedirecting(true);
          router.replace(stepNumber < totalSteps ? `/onboarding/${stepNumber + 1}` : '/onboarding/1');
          return;
        }
        setPageConfig(cfg);

        // expose initial form values (your action already returns profile_data || {})
        if (profileRes.success && profileRes.data && typeof profileRes.data === 'object') {
          setInitialForm(profileRes.data as Record<string, unknown>); // ← NEW
        }
      } catch (error) {
        console.error('Error during data fetch:', error);
      } finally {
        setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [router, stepNumber]);

  return { loading, redirecting, userEmail, components, pageConfig, totalSteps, initialForm }; // ← return it
}
