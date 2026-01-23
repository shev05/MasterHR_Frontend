import { useId } from 'react';

import {
  BaseSelect,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';

import type { BaseSelectProps, FieldErrorProps, fieldVariants } from '@/shared/components/ui';
import type { OptionBase } from '@/shared/interface';
import type { VariantProps } from 'class-variance-authority';
import type { FC } from 'react';

export type SelectProps = BaseSelectProps & {
  label: string;
  invalid?: boolean;
  error?: FieldErrorProps['errors'];
  description?: string;
  placeholder?: string;
  options?: OptionBase[];
  fieldOrientation?: VariantProps<typeof fieldVariants>['orientation'];
};

export const Select: FC<SelectProps> = ({
  label,
  required = false,
  invalid = false,
  error,
  description,
  placeholder,
  options,
  fieldOrientation,
  ...props
}) => {
  const selectId = useId();

  return (
    <Field data-invalid={invalid} orientation={fieldOrientation}>
      {label && (
        <FieldLabel htmlFor={selectId} className='px-2'>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <div id={selectId}>
        <BaseSelect items={options || []} id={selectId} {...props}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectPositioner className='max-w-(--anchor-width) z-50 w-full'>
            <SelectContent>
              {!options || options.length === 0 ? (
                <FieldLabel className='text-muted-foreground px-2 py-1.5 text-xs'>Нет доступных вариантов</FieldLabel>
              ) : (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </SelectPositioner>
        </BaseSelect>
      </div>
      {invalid && <FieldError errors={error} className='px-2' />}
      {description && <FieldDescription className='px-2'>{description}</FieldDescription>}
    </Field>
  );
};
