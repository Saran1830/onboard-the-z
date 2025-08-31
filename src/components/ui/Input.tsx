'use client'

import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | undefined
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    const baseStyles = `
      w-full p-3 text-base rounded-lg border transition-all duration-200 outline-none
      backdrop-filter backdrop-blur-sm
      ${error 
        ? 'border-red-400 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
        : 'border-gray-300 bg-white/60 hover:bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
      }
      focus:transform focus:-translate-y-0.5 focus:shadow-lg
      disabled:bg-gray-100 disabled:cursor-not-allowed
    `.trim()
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block font-medium text-gray-800 text-sm tracking-wide"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" title="Required field">*</span>
            )}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${className}`}
          {...props}
        />
        
        {(error || helperText) && (
          <div className={`text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
            {error && (
              <div className="flex items-center">
                <span className="text-red-500 mr-1">⚠️</span>
                {error}
              </div>
            )}
            {!error && helperText && helperText}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }