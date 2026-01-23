import { useId } from 'react';

import { BaseInput, Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';

import type { BaseInputProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type InputProps = BaseInputProps & {
  label?: string;
  description?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
};

export const Input: FC<InputProps> = ({ label, required = false, errors, invalid = false, description, ...props }) => {
  const inputId = useId();

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={inputId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <BaseInput id={inputId} aria-invalid={invalid} {...props} />
      {invalid && <FieldError errors={errors} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
