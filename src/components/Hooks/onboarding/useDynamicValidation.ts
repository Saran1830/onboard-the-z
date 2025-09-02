'use client';

import { useMemo } from 'react';
import type { CustomComponent, PageConfig } from '../../../types/components';
import {
  validateEmail, validateUrl, validatePhone, validateDate, validateNumber, validateText
} from '../../../../shared/validations/validators';

export type UseDynamicValidationResult = {
  validateForm: (values: Record<string, unknown>) => Record<string, string>;
};

export function useDynamicValidation({
    components,
    pageConfig,
}: {
    components: CustomComponent[];
    pageConfig: PageConfig | null;
}): UseDynamicValidationResult {        // <-- explicit return type

    // Memoize expensive validation functions
    const validateFieldType = useMemo(() => {
        return (value: string, type: CustomComponent['type']) => {
            if (!value || value.trim() === '') return null;
            switch (type) {
                case 'email':   return validateEmail(value);
                case 'url':     return validateUrl(value);
                case 'phone':   return validatePhone(value);
                case 'date':    return validateDate(value);
                case 'number':  return validateNumber(value);
                case 'text':
                case 'textarea':return validateText(value, 1, 1000);
                default:        return null;
            }
        };
    }, []);

    // Memoize component lookup map for better performance
    const componentMap = useMemo(() => {
        const map = new Map<string, CustomComponent>();
        components.forEach(comp => map.set(comp.name, comp));
        return map;
    }, [components]);

    const validateForm = useMemo(() => {
        return (values: Record<string, unknown>) => {
            const errors: Record<string, string> = {};
            if (!pageConfig) return errors;

            for (const name of pageConfig.components) {
                const comp = componentMap.get(name);
                if (!comp) continue;

                if (comp.name === 'address') {
                    const address = values.address as Record<string, string> | undefined;
                    if (comp.required) {
                        if (!address?.street)  errors['address.street']  = 'Street address is required';
                        if (!address?.city)    errors['address.city']    = 'City is required';
                        if (!address?.state)   errors['address.state']   = 'State is required';
                        if (!address?.zipCode) errors['address.zipCode'] = 'ZIP code is required';
                        if (!address?.country) errors['address.country'] = 'Country is required';
                    }
                    if (address?.zipCode && !isValidZipCode(address.zipCode)) {
                    errors['address.zipCode'] = 'Please enter a valid ZIP code';
                }
                continue;
            }

            const val = values[comp.name];

            if (comp.required && (!val || (typeof val === 'string' && val.trim() === ''))) {
                errors[comp.name] = `${comp.label} is required`;
                continue;
            }

            if (val && typeof val === 'string' && val.trim() !== '') {
                const e = validateFieldType(val, comp.type);
                if (e) errors[comp.name] = e;
            }
        }

        return errors;
    };
    }, [pageConfig, componentMap, validateFieldType]);

    return { validateForm };              // <-- make sure we return this
}

function isValidZipCode(zipCode: string) {
    // US ZIP code: 5 digits or 5+4 digits (e.g. 12345 or 12345-6789)
    // Accepts only digits and optional dash
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode.trim());
}


