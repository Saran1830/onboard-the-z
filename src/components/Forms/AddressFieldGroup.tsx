import React from 'react';
import { FORM_PLACEHOLDERS } from '../../constants/ui';
import { Input } from '../ui/Input';

interface AddressFieldGroupProps {
  value: Record<string, string>;
  onChange: (addressData: Record<string, string>) => void;
  errors: Record<string, string>;
  required?: boolean;
  label?: string; // Add dynamic label prop
  className?: string;
}

const AddressFieldGroup: React.FC<AddressFieldGroupProps> = ({
  value = {},
  onChange,
  errors = {},
  required = false,
  label = "Address Information", // Default label with dynamic option
  className = ""
}) => {
  // Ensure value is always an object
  const addressValue = React.useMemo(() => {
    return typeof value === 'object' && value !== null ? value : {};
  }, [value]);

  const updateField = (field: string, fieldValue: string) => {
    const newAddress = {
      ...addressValue,
      [field]: fieldValue
    };
    onChange(newAddress);
  };

  return (
    <fieldset className={`address-field-group border border-gray-200 rounded-lg p-4 bg-white/40 ${className}`}>
      <legend className="font-medium text-gray-800 px-2 text-sm sm:text-base tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-1" title="Required field">*</span>}
      </legend>
      
      <div className="grid grid-cols-1 gap-4 mt-2">
        {/* Street Address */}
        <Input
          type="text"
          id="street"
          name="street"
          placeholder={FORM_PLACEHOLDERS.address.street}
          value={addressValue.street || ''}
          onChange={e => updateField('street', e.target.value)}
          required={required}
          label="Street Address"
          error={errors.street}
        />

        {/* City and State Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="text"
            id="city"
            name="city"
            placeholder={FORM_PLACEHOLDERS.address.city}
            value={addressValue.city || ''}
            onChange={e => updateField('city', e.target.value)}
            required={required}
            label="City"
            error={errors.city}
          />

          <Input
            type="text"
            id="state"
            name="state"
            placeholder={FORM_PLACEHOLDERS.address.state}
            value={addressValue.state || ''}
            onChange={e => updateField('state', e.target.value)}
            required={required}
            label="State/Province"
            error={errors.state}
          />
        </div>

        {/* ZIP and Country Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="text"
            id="zipCode"
            name="zipCode"
            placeholder={FORM_PLACEHOLDERS.address.zipCode}
            value={addressValue.zipCode || ''}
            onChange={e => updateField('zipCode', e.target.value)}
            required={required}
            label="ZIP/Postal Code"
            error={errors.zipCode}
          />

          <div>
            <label htmlFor="country" className="block font-medium text-gray-800 text-sm tracking-wide mb-1">
              Country
              {required && <span className="text-red-500 ml-1" title="Required field">*</span>}
            </label>
            <select
              id="country"
              name="country"
              value={addressValue.country || ''}
              onChange={e => updateField('country', e.target.value)}
              required={required}
              className={`w-full p-3 text-base rounded-lg border transition-all duration-200 outline-none backdrop-filter backdrop-blur-sm ${
                errors.country 
                  ? 'border-red-400 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 bg-white/60 hover:bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } focus:transform focus:-translate-y-0.5 focus:shadow-lg`}
              aria-describedby={errors.country ? 'country-error' : undefined}
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="Other">Other</option>
            </select>
            {errors.country && (
              <div className="text-sm text-red-600 mt-1">
                <div className="flex items-center">
                  <span className="text-red-500 mr-1">⚠️</span>
                  {errors.country}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default AddressFieldGroup;