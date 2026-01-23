import { useId } from 'react';

import { BaseCheckbox, Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui';

import type { FC } from 'react';
import type { BaseCheckboxProps, FieldErrorProps } from '@/shared/components/ui';

export type CheckboxProps = BaseCheckboxProps & {
  label?: string;
  error?: FieldErrorProps['errors'];
  descriprion?: string;
  invalid?: boolean;
};

export const Checkbox: FC<CheckboxProps> = ({
  label,
  required = false,
  error,
  descriprion,
  invalid = false,
  ...props
}) => {
  const checkboxId = useId();

  return (
    <Field orientation='horizontal' data-invalid={invalid}>
      <BaseCheckbox id={checkboxId} {...props} />
      {label && (
        <FieldLabel htmlFor={checkboxId}>
          {label}
          {required && '*'}
        </FieldLabel>
      )}
      {descriprion && <FieldDescription>{descriprion}</FieldDescription>}
      {invalid && <FieldError errors={error} />}
    </Field>
  );
};
