import { useId } from 'react';

import { BasePasswordInput, Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';

import type { BasePasswordInputProps, FieldErrorProps } from '@/shared/components/ui';
import type { FC } from 'react';

export type PasswordInputProps = BasePasswordInputProps & {
  label?: string;
  description?: string;
  errors?: FieldErrorProps['errors'];
  invalid?: boolean;
};

export const PasswordInput: FC<PasswordInputProps> = ({
  label,
  description,
  errors,
  placeholder = 'Введите значение',
  invalid = false,
  required = false,
  ...props
}) => {
  const passwordInputId = useId();

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={passwordInputId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <BasePasswordInput id={passwordInputId} placeholder={placeholder} aria-invalid={invalid} {...props} />
      {invalid && <FieldError className='px-2' errors={errors} />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
