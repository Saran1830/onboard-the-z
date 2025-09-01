'use client';

import React from 'react';
import { useToast, type Toast } from './ToastContext';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast();

  const typeStyles = {
    success: 'bg-white border-gray-200 text-gray-800',
    error: 'bg-white border-gray-200 text-gray-800',
    warning: 'bg-white border-gray-200 text-gray-800',
    info: 'bg-white border-gray-200 text-gray-800',
  };


  return (
    <div
      className={`
        w-96 max-w-md shadow-lg rounded-lg pointer-events-auto border p-4 mb-3
        transform transition-all duration-300 ease-in-out
        animate-in slide-in-from-top
        ${typeStyles[toast.type]}
      `}
    >
      <div className="flex items-start">
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-sm opacity-90">
              {toast.message}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
            onClick={() => removeToast(toast.id)}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
      style={{ zIndex: 9999 }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
