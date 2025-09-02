import React from 'react';

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
  const updateField = (field: string, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  const baseInputClass = (fieldName: string) => `
    w-full p-3 text-base rounded-lg border transition-all duration-200 outline-none
    backdrop-filter backdrop-blur-sm min-h-[48px] sm:text-base
    ${errors[fieldName] 
      ? 'border-red-400 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-300 bg-white/60 hover:bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    }
    focus:transform focus:-translate-y-0.5 focus:shadow-lg
  `.trim();

  return (
    <fieldset className={`address-field-group border border-gray-200 rounded-lg p-4 bg-white/40 ${className}`}>
      <legend className="font-medium text-gray-800 px-2 text-sm sm:text-base tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-1" title="Required field">*</span>}
      </legend>
      
      <div className="grid grid-cols-1 gap-4 mt-2">
        {/* Street Address */}
        <div>
          <label htmlFor="street" className="block font-medium text-gray-600 mb-1 text-sm sm:text-base">
            Street Address
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            id="street"
            name="street"
            placeholder="123 Main Street"
            value={value.street || ''}
            onChange={e => updateField('street', e.target.value)}
            className={baseInputClass('street')}
            required={required}
            aria-describedby={errors.street ? 'street-error' : undefined}
          />
          {errors.street && (
            <div id="street-error" className="text-red-600 text-sm mt-2 flex items-center" role="alert">
              <span className="text-red-500 mr-1">⚠️</span>
              {errors.street}
            </div>
          )}
        </div>

        {/* City and State Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block font-medium text-gray-600 mb-1 text-sm sm:text-base">
              City
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="New York"
              value={value.city || ''}
              onChange={e => updateField('city', e.target.value)}
              className={baseInputClass('city')}
              required={required}
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
            {errors.city && (
              <div id="city-error" className="text-red-600 text-sm mt-1" role="alert">
                {errors.city}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block font-medium text-gray-600 mb-1 text-sm sm:text-base">
              State/Province
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="NY"
              value={value.state || ''}
              onChange={e => updateField('state', e.target.value)}
              className={baseInputClass('state')}
              required={required}
              aria-describedby={errors.state ? 'state-error' : undefined}
            />
            {errors.state && (
              <div id="state-error" className="text-red-600 text-sm mt-1" role="alert">
                {errors.state}
              </div>
            )}
          </div>
        </div>

        {/* ZIP and Country Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block font-medium text-gray-600 mb-1">
              ZIP/Postal Code
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              placeholder="10001"
              value={value.zipCode || ''}
              onChange={e => updateField('zipCode', e.target.value)}
              className={baseInputClass('zipCode')}
              required={required}
              aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
            />
            {errors.zipCode && (
              <div id="zipCode-error" className="text-red-600 text-sm mt-1" role="alert">
                {errors.zipCode}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block font-medium text-gray-600 mb-1">
              Country
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id="country"
              name="country"
              value={value.country || ''}
              onChange={e => updateField('country', e.target.value)}
              className={baseInputClass('country')}
              required={required}
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
              <div id="country-error" className="text-red-600 text-sm mt-1" role="alert">
                {errors.country}
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default AddressFieldGroup;