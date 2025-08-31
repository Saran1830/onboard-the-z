'use client';

import React from 'react';
import FormField from '../_components/forms/FormField';
import AddressFieldGroup from '../_components/forms/AddressFieldGroup';
import type { CustomComponent, PageConfig } from '../../../types/components';

export default function FieldList({
  components,
  pageConfig,
  values,
  onChange,
  errorFor,
  addressErrors,
}: {
  components: CustomComponent[];
  pageConfig: PageConfig;
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  errorFor: (name: string) => string | undefined;
  addressErrors?: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      {pageConfig.components.map((name) => {
        const comp = components.find((c) => c.name === name);
        if (!comp) return null;

        if (comp.name === 'address') {
          return (
            <AddressFieldGroup
              key={comp.id}
              value={(values[comp.name] as Record<string, string>) || {}}
              onChange={(data) => onChange(comp.name, data)}
              errors={addressErrors || {}}
              required={comp.required}
              className="mb-6"
            />
          );
        }

        return (
          <FormField
            key={comp.id}
            component={comp}
            value={typeof values[comp.name] === 'string' ? values[comp.name] as string : ''}
            onChange={onChange}
            error={errorFor(comp.name)}
            className="mb-4"
          />
        );
      })}
    </div>
  );
}
