import React from 'react';
import { CustomComponent } from '../../../../types/components';
import AddressFieldGroup from './AddressFieldGroup';

interface FormFieldProps {
  component: CustomComponent;
  value: string | object; // Updated to handle address objects
  onChange: (name: string, value: string | object) => void; // Updated to handle address objects
  error?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  component,
  value,
  onChange,
  error,
  className = ""
}) => {
  const baseInputClass = `
    w-full p-3 text-base rounded-lg border transition-all duration-200 outline-none
    backdrop-filter backdrop-blur-sm min-h-[48px] sm:text-base
    ${error 
      ? 'border-red-400 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-300 bg-white/60 hover:bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    }
    focus:transform focus:-translate-y-0.5 focus:shadow-lg
  `.trim();

  const renderField = () => {
    switch (component.type) {
      case 'address':
        return (
          <AddressFieldGroup
            value={value as Record<string, string> || {}}
            onChange={(addressData) => onChange(component.name, addressData)}
            errors={error ? { general: error } : {}}
            required={component.required}
            label={component.label} // Pass the component's label dynamically
          />
        );

      case 'text':
        return (
          <input
            type="text"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            className={baseInputClass}
            aria-describedby={error ? `${component.name}-error` : undefined}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            className={`${baseInputClass} min-h-[100px] resize-vertical`}
            aria-describedby={error ? `${component.name}-error` : undefined}
            rows={4}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            id={component.name}
            name={component.name}
            required={component.required}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            className={baseInputClass}
            aria-describedby={error ? `${component.name}-error` : undefined}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            className={baseInputClass}
            aria-describedby={error ? `${component.name}-error` : undefined}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            className={baseInputClass}
            aria-describedby={error ? `${component.name}-error` : undefined}
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder || "(555) 123-4567"}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            className={baseInputClass}
            aria-describedby={error ? `${component.name}-error` : undefined}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder || "https://example.com"}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            className={baseInputClass}
            aria-describedby={error ? `${component.name}-error` : undefined}
          />
        );

      default:
        return (
          <input
            type="text"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            className={baseInputClass}
            aria-describedby={error ? `${component.name}-error` : undefined}
          />
        );
    }
  };

  return (
    <div className={`form-field ${className}`}>
      {/* Only show label for non-address fields since AddressFieldGroup has its own fieldset/legend */}
      {component.type !== 'address' && (
        <label 
          htmlFor={component.name}
          className="block font-medium text-gray-800 mb-2 text-sm sm:text-base tracking-wide"
        >
          {component.label}
          {component.required && (
            <span className="text-red-500 ml-1" title="Required field">*</span>
          )}
        </label>
      )}
      {renderField()}
      {error && component.type !== 'address' && (
        <div 
          id={`${component.name}-error`}
          className="text-red-600 text-sm mt-2 flex items-center"
          role="alert"
        >
          <span className="text-red-500 mr-1">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;