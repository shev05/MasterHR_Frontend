import { useId } from 'react';

import { BaseDateRangePicker, Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';

import type { BaseDateRangePickerProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type DateRangePickerProps = BaseDateRangePickerProps & {
  label?: string;
  description?: string;
  error?: FieldErrorProps['errors'];
  invalid?: boolean;
  required?: boolean;
};

export const DateRangePicker: FC<DateRangePickerProps> = ({
  label,
  required = false,
  invalid = false,
  placeholder = 'Выберите значение',
  error,
  description,
  ...props
}) => {
  const datePickerId = useId();

  return (
    <Field>
      {label && (
        <FieldLabel htmlFor={datePickerId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <BaseDateRangePicker {...props} id={datePickerId} placeholder={placeholder} />
      {invalid && <FieldError errors={error} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
