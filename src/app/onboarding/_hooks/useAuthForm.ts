'use client';

import { useCallback, useState } from 'react';
import { validateEmail, validateText } from '../../../../shared/validations/validators';

type Mode = 'signin' | 'signup';

export type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

export function useAuthForm(opts: {
  initialMode?: Mode;
  onSubmitAuth: (email: string, password: string, mode: Mode) => Promise<void>;
}) {
  const { initialMode = 'signup', onSubmitAuth } = opts;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [values, setValues] = useState<AuthFormValues>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  const validate = useCallback((v: AuthFormValues): AuthFormErrors => {
    const nextErrors: AuthFormErrors = {};

    // email
    const emailErr = validateEmail(v.email);
    if (emailErr) nextErrors.email = emailErr;

    // password (min length 6 via validateText)
    const pwdErr = validateText(v.password, 6, 1000);
    if (pwdErr) nextErrors.password = pwdErr;

    // confirm password only in signup
    if (isSignup) {
      const confirmErr = validateText(v.confirmPassword, 6, 1000) || null;
      if (confirmErr) {
        nextErrors.confirmPassword = confirmErr;
      } else if (v.confirmPassword !== v.password) {
        nextErrors.confirmPassword = 'Passwords do not match';
      }
    }

    return nextErrors;
  }, [isSignup]);

  const clearFieldError = useCallback((field: keyof AuthFormValues) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const setField = useCallback((field: keyof AuthFormValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // clear error as user edits
    setErrors(prev => {
      if (!prev[field]) return prev;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const toggleMode = useCallback(() => {
    setMode(m => (m === 'signup' ? 'signin' : 'signup'));
    // clear confirmPassword and related error when switching to signin
    setValues(prev => ({ ...prev, confirmPassword: '' }));
    setErrors(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...rest } = prev;
      return rest;
    });
    setServerError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    setServerError(null);
    const fieldErrors = validate(values);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      return; // don’t submit
    }

    setLoading(true);
    try {
      await onSubmitAuth(values.email, values.password, mode);
    } catch (err) {
      // normalize server/auth error messages here
      setServerError(
        typeof err === 'string'
          ? err
          : (err instanceof Error && err.message)
          ? err.message
          : 'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [mode, onSubmitAuth, validate, values]);

  return {
    // state
    mode,
    values,
    errors,
    loading,
    serverError,

    // derived
    isSignup,

    // actions
    setField,
    clearFieldError,
    toggleMode,
    handleSubmit,
    setMode,
    setServerError,
  };
}
