'use client';

import * as React from 'react';
import { DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  name?: string;
}

export function CurrencyInput({
  value,
  onChange,
  label,
  error,
  disabled,
  placeholder = '0.00',
  min = 0,
  max,
  className,
  name,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState(
    value !== undefined ? value.toFixed(2) : ''
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value.toFixed(2));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue(rawValue);

    const numericValue = parseFloat(rawValue);
    if (!isNaN(numericValue)) {
      onChange?.(numericValue);
    } else if (rawValue === '') {
      onChange?.(0);
    }
  };

  const handleBlur = () => {
    const numericValue = parseFloat(displayValue);
    if (!isNaN(numericValue)) {
      let finalValue = numericValue;
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
      setDisplayValue(finalValue.toFixed(2));
      onChange?.(finalValue);
    } else {
      setDisplayValue('0.00');
      onChange?.(0);
    }
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <DollarSign className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          inputMode="decimal"
          name={name}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full rounded-lg border bg-white pl-8 pr-3 py-2 text-sm ring-offset-white',
            'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-500' : 'border-gray-300'
          )}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
