import React from 'react';
import { CustomComponent } from '../../types/components';
import { FORM_PLACEHOLDERS } from '../../constants/ui';
import { Input } from '../ui/Input';
import AddressFieldGroup from './AddressFieldGroup';

interface FormFieldProps {
  component: CustomComponent;
  value: string | object; // Updated to handle address objects
  onChange: (name: string, value: string | object) => void; // Updated to handle address objects
  error?: string;
  addressErrors?: Record<string, string>; // Add addressErrors prop
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  component,
  value,
  onChange,
  error,
  addressErrors,
  className = ""
}) => {
  const renderField = () => {
    switch (component.type) {
      case 'address':
        return (
          <AddressFieldGroup
            value={value as Record<string, string> || {}}
            onChange={(addressData) => onChange(component.name, addressData)}
            errors={addressErrors || {}}
            required={component.required}
            label={component.label} // Pass the component's label dynamically
          />
        );

      case 'text':
        return (
          <Input
            type="text"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            label={component.label}
            error={error}
          />
        );

      case 'textarea':
        return (
          <div>
            <label 
              htmlFor={component.name}
              className="block font-medium text-gray-800 mb-1 text-sm sm:text-base tracking-wide"
            >
              {component.label}
              {component.required && (
                <span className="text-red-500 ml-1" title="Required field">*</span>
              )}
            </label>
            <textarea
              id={component.name}
              name={component.name}
              required={component.required}
              placeholder={component.placeholder}
              value={value as string}
              onChange={e => onChange(component.name, e.target.value)}
              className={`w-full p-3 text-base rounded-lg border transition-all duration-200 outline-none backdrop-filter backdrop-blur-sm min-h-[100px] resize-vertical ${
                error 
                  ? 'border-red-400 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 bg-white/60 hover:bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } focus:transform focus:-translate-y-0.5 focus:shadow-lg`}
              aria-describedby={error ? `${component.name}-error` : undefined}
              rows={4}
            />
            {error && (
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

      case 'date':
        return (
          <Input
            type="date"
            id={component.name}
            name={component.name}
            required={component.required}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            label={component.label}
            error={error}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            label={component.label}
            error={error}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            label={component.label}
            error={error}
          />
        );

      case 'phone':
        return (
          <Input
            type="tel"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder || FORM_PLACEHOLDERS.phone}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            label={component.label}
            error={error}
          />
        );

      case 'url':
        return (
          <Input
            type="url"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder || FORM_PLACEHOLDERS.url}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            label={component.label}
            error={error}
          />
        );

      default:
        return (
          <Input
            type="text"
            id={component.name}
            name={component.name}
            required={component.required}
            placeholder={component.placeholder}
            value={value as string}
            onChange={e => onChange(component.name, e.target.value)}
            label={component.label}
            error={error}
          />
        );
    }
  };

  return (
    <div className={`form-field ${className}`}>
      {renderField()}
    </div>
  );
};

export default FormField;