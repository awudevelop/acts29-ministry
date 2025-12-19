'use client';

import { useCallback, useState } from 'react';
import type { ZodSchema, ZodError } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  schema?: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface FieldState {
  touched: boolean;
  error: string | null;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T, value: T[keyof T]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  reset: () => void;
  getFieldProps: (field: keyof T) => {
    value: T[keyof T];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    name: string;
    id: string;
  };
}

/**
 * Custom form hook with Zod validation support
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  schema,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [fieldState, setFieldState] = useState<Partial<Record<keyof T, FieldState>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | null => {
      if (!schema) return null;

      try {
        schema.parse({ ...values, [field]: value });
        return null;
      } catch (error) {
        const zodError = error as ZodError;
        const fieldError = zodError.errors.find((e) => e.path[0] === field);
        return fieldError?.message ?? null;
      }
    },
    [schema, values]
  );

  const validateAll = useCallback((): boolean => {
    if (!schema) return true;

    try {
      schema.parse(values);
      return true;
    } catch (error) {
      const zodError = error as ZodError;
      const newFieldState: Partial<Record<keyof T, FieldState>> = {};

      zodError.errors.forEach((e) => {
        const field = e.path[0] as keyof T;
        newFieldState[field] = {
          touched: true,
          error: e.message,
        };
      });

      setFieldState((prev) => ({ ...prev, ...newFieldState }));
      return false;
    }
  }, [schema, values]);

  const handleChange = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (fieldState[field]?.touched) {
        const error = validateField(field, value);
        setFieldState((prev) => ({
          ...prev,
          [field]: { touched: true, error },
        }));
      }
    },
    [fieldState, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      const error = validateField(field, values[field]);
      setFieldState((prev) => ({
        ...prev,
        [field]: { touched: true, error },
      }));
    },
    [validateField, values]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateAll()) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, validateAll, values]
  );

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFieldState((prev) => ({
      ...prev,
      [field]: { touched: true, error },
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setFieldState({});
  }, [initialValues]);

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        handleChange(field, e.target.value as T[keyof T]);
      },
      onBlur: () => handleBlur(field),
      name: String(field),
      id: String(field),
    }),
    [values, handleChange, handleBlur]
  );

  // Derived state
  const errors = Object.fromEntries(
    Object.entries(fieldState).map(([key, state]) => [key, state?.error])
  ) as Partial<Record<keyof T, string>>;

  const touched = Object.fromEntries(
    Object.entries(fieldState).map(([key, state]) => [key, state?.touched ?? false])
  ) as Partial<Record<keyof T, boolean>>;

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  const isValid = !Object.values(fieldState).some((state) => state?.error);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
    getFieldProps,
  };
}
