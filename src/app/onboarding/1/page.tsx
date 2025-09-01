'use client'

import React from 'react';
import AuthForm from '../_components/forms/AuthForm';
import { useAuthForm } from '../_hooks/useAuthForm';
import { signInUser, signUpUser } from '../../../../server/actions/auth';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const onSubmitAuth = async (email: string, password: string, mode: 'signin'|'signup') => {
    let result;
    if (mode === 'signin') {
      result = await signInUser(email, password);
    } else {
      result = await signUpUser(email, password);
    }
    
    if (!result.success) {
      throw new Error(result.error || 'Authentication failed');
    }
    
    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
  };

  const initialMode = 'signup' as 'signin'|'signup';
  const {
    mode, values, errors, serverError, loading,
    setField, toggleMode, handleSubmit,
  } = useAuthForm({ initialMode, onSubmitAuth });


  return (
    <div className='p-6'>
      <AuthForm
        mode={mode}
        values={values}
        errors={errors}
        serverError={serverError}
        loading={loading}
        onChange={setField}
        onToggleMode={toggleMode}
        onSubmit={handleSubmit}
      />
    </div>
  );
}