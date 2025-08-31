'use client';
import React from 'react';
import GlassCard from '@/components/GlassCard';
import StepIndicator from '@/components/StepIndicator';

export default function StepShell({
  stepNumber,
  totalSteps,
  title,
  header,
  children,
  maxWidth = '640px',
}: React.PropsWithChildren<{
  stepNumber: number;
  totalSteps: number;
  title?: string;
  header?: React.ReactNode;
  maxWidth?: string;
}>) {
  return (
    <GlassCard style={{ maxWidth, margin: 'auto', padding: 20 }}>
      <StepIndicator current={stepNumber} total={totalSteps} />
      {title && <h1 className="text-center font-bold text-2xl mb-6 text-gray-800">{title}</h1>}
      {header}
      {children}
    </GlassCard>
  );
}
