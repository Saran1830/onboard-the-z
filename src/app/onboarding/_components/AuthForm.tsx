'use client';

import React from 'react';
import { Button, Input, Card } from '../../../components/ui';

type Mode = 'signin' | 'signup';

export type AuthFormUIProps = {
  mode: Mode;
  values: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: Partial<Record<'email'|'password'|'confirmPassword', string>>;
  loading?: boolean;
  serverError?: string | null;

  onChange: (field: 'email'|'password'|'confirmPassword', value: string) => void;
  onToggleMode: () => void;
  onSubmit: () => void;
};

const AuthForm: React.FC<AuthFormUIProps> = ({
  mode,
  values,
  errors,
  loading = false,
  serverError = null,
  onChange,
  onToggleMode,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-600">
          {mode === 'signup'
            ? 'Sign up to start your onboarding journey'
            : 'Sign in to continue your onboarding'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={e => onChange('email', e.currentTarget.value)}
          error={errors.email || undefined}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={values.password}
          onChange={e => onChange('password', e.currentTarget.value)}
          error={errors.password || undefined}
          required
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {mode === 'signup' && (
          <Input
            label="Confirm Password"
            type="password"
            value={values.confirmPassword}
            onChange={e => onChange('confirmPassword', e.currentTarget.value)}
            error={errors.confirmPassword || undefined}
            required
            autoComplete="new-password"
          />
        )}

        {/* Consolidated client-side validation summary */}
        {(errors.email || errors.password || errors.confirmPassword) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 font-medium mb-2">Please fix the following errors:</div>
            <ul className="text-red-700 text-sm space-y-1">
              {errors.email && <li>• {errors.email}</li>}
              {errors.password && <li>• {errors.password}</li>}
              {errors.confirmPassword && <li>• {errors.confirmPassword}</li>}
            </ul>
          </div>
        )}

        {/* Server/auth error */}
        {serverError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              {serverError}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onToggleMode}
            className="w-full bg-gray-100 hover:bg-gray-200"
          >
            {mode === 'signup'
              ? 'Already have an account? Sign In'
              : 'New user? Sign Up'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AuthForm;
