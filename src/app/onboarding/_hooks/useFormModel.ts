'use client';

import { useCallback, useState } from 'react';

export function useFormModel() {
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((name: string, value: unknown) => {
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const clearError = useCallback((name: string) => {
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const addressErrorsFrom = useCallback((errors: Record<string, string>) => {
    const bag: Record<string, string> = {};
    for (const [k, v] of Object.entries(errors)) {
      if (k.startsWith('address.')) bag[k.split('.')[1]] = v;
    }
    return bag;
  }, []);

  const errorFor = useCallback((name: string) => formErrors[name], [formErrors]);

  return {
    form, setForm, setField,
    formErrors, setFormErrors, clearError,
    addressErrorsFrom,
    errorFor,
    submitting, setSubmitting,
  };
}
