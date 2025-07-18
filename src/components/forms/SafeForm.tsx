import React, { ReactNode } from 'react';
import { useForm, FieldValues, SubmitHandler, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAsyncCallback } from '@/hooks/useAsync';
import { errorHandler } from '@/lib/error-handler';

interface SafeFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
  children: ReactNode;
  defaultValues?: Partial<T>;
  submitLabel?: string;
  className?: string;
  showSubmitButton?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function SafeForm<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  defaultValues,
  submitLabel = 'Submit',
  className = '',
  showSubmitButton = true,
  onSuccess,
  onError,
}: SafeFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });

  const { execute: handleSubmit, loading } = useAsyncCallback(
    async (data: T) => {
      try {
        await onSubmit(data);
        if (onSuccess) {
          onSuccess();
        } else {
          errorHandler.showUserSuccess('Form submitted successfully!');
        }
        form.reset();
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
        throw error;
      }
    },
    [onSubmit, onSuccess, onError, form]
  );

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className={`space-y-6 ${className}`}
        noValidate
      >
        {children}
        
        {showSubmitButton && (
          <Button 
            type="submit" 
            disabled={loading || !form.formState.isValid}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Submitting...' : submitLabel}
          </Button>
        )}
      </form>
    </Form>
  );
}