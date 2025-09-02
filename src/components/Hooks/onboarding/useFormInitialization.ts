'use client';

import { useEffect } from 'react';
import type { CustomComponent } from '../../../types/components';

interface UseFormInitializationProps {
  initialForm: Record<string, unknown> | null;
  components: CustomComponent[];
  setForm: (updater: (prev: Record<string, unknown>) => Record<string, unknown>) => void;
}

/**
 * Custom hook to handle form initialization with special handling for address fields
 * Ensures address fields are always initialized as objects when address components exist
 */
export function useFormInitialization({
  initialForm,
  components,
  setForm
}: UseFormInitializationProps) {
  useEffect(() => {
    if (initialForm) {
      // Merge DB values first so any user-edited fields win if already typed
      setForm(prev => {
        const merged = { ...initialForm, ...prev };
        
        // Ensure address field is initialized as an object if it exists in components
        const hasAddressComponent = components.some(comp => comp.type === 'address');
        if (hasAddressComponent && !merged.address) {
          merged.address = {};
        }
        
        return merged;
      });
    } else if (components.length > 0) {
      // Initialize form with empty address object if there's an address component but no initial data
      const hasAddressComponent = components.some(comp => comp.type === 'address');
      if (hasAddressComponent) {
        setForm(prev => ({
          ...prev,
          address: prev.address || {}
        }));
      }
    }
  }, [initialForm, setForm, components]);
}
