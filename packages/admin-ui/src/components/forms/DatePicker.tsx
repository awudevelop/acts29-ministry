'use client';

import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
  name?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  error,
  disabled,
  min,
  max,
  className,
  name,
}: DatePickerProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <input
          type="date"
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          min={min}
          max={max}
          className={cn(
            'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white',
            'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-500' : 'border-gray-300'
          )}
        />
        <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
  error,
  disabled,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange?.(e.target.value)}
            disabled={disabled}
            max={endDate}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white',
              'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-red-500' : 'border-gray-300'
            )}
          />
        </div>
        <span className="text-gray-500">to</span>
        <div className="relative flex-1">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange?.(e.target.value)}
            disabled={disabled}
            min={startDate}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white',
              'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-red-500' : 'border-gray-300'
            )}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
