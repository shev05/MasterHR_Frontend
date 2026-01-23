import { useId } from 'react';

import { BaseDatePicker, Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';

import type { BaseDatePickerProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type DatePickerProps = BaseDatePickerProps & {
  label: string;
  error?: FieldErrorProps['errors'];
  description?: string;
  invalid?: boolean;
  required?: boolean;
};

export const DatePicker: FC<DatePickerProps> = ({
  label,
  required = false,
  error,
  invalid = false,
  placeholder = 'Выберите значение',
  description,
  ...props
}) => {
  const datePickerId = useId();

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={datePickerId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <BaseDatePicker placeholder={placeholder} {...props} id={datePickerId} />
      {invalid && <FieldError errors={error} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
