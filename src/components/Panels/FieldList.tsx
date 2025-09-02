'use client';

import React from 'react';
import FormField from '../Forms/FormField';
import type { CustomComponent, PageConfig } from '../../types/components';

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

        // Handle address fields with proper error passing
        if (comp.type === 'address') {
          return (
            <FormField
              key={comp.id}
              component={comp}
              value={(values[comp.name] as Record<string, string>) || {}}
              onChange={onChange}
              error={errorFor(comp.name)}
              addressErrors={addressErrors}
              className="mb-6"
            />
          );
        }

        // Handle all other field types
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
