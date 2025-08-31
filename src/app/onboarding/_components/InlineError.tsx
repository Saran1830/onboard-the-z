'use client';
import React from 'react';

export default function InlineError({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      <div className="flex items-center">
        {message}
      </div>
    </div>
  );
}
