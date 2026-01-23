import { useId, useState, type FC } from 'react';

import {
  BaseSelect,
  Button,
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

export type MultipleSelectProps = BaseSelectProps & {
  label: string;
  invalid?: boolean;
  error?: FieldErrorProps['errors'];
  description?: string;
  placeholder?: string;
  options?: OptionBase[];
  fieldOrientation?: VariantProps<typeof fieldVariants>['orientation'];
};

export const MultipleSelect: FC<MultipleSelectProps> = ({
  label,
  required = false,
  invalid = false,
  error,
  description,
  placeholder = 'Выберите значения',
  options,
  fieldOrientation,
  ...props
}) => {
  const selectId = useId();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleRemoveValue = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues((prev) => prev.filter((val) => val !== valueToRemove));
  };

  const handleValueChange = (value: unknown) => {
    if (Array.isArray(value)) {
      const stringArray = value.every((item) => typeof item === 'string')
        ? (value as string[])
        : value.map((item) => String(item));
      setSelectedValues(stringArray);
    } else if (typeof value === 'string') {
      setSelectedValues([value]);
    } else {
      setSelectedValues(value ? [String(value)] : []);
    }
  };

  return (
    <Field data-invalid={invalid} orientation={fieldOrientation}>
      {label && (
        <FieldLabel htmlFor={selectId}>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FieldLabel>
      )}
      <div id={selectId}>
        <BaseSelect
          items={options || []}
          id={selectId}
          multiple
          value={selectedValues}
          onValueChange={handleValueChange}
          {...props}
        >
          <SelectTrigger className='w-full'>
            <SelectValue
              placeholder={placeholder}
              render={(_, { value: currentValue }) => {
                const values = Array.isArray(currentValue) ? currentValue : currentValue ? [currentValue] : [];

                if (values.length > 0) {
                  const selectedOptions = values.map((val) => {
                    const option = options?.find((opt) => opt.value === val);
                    return { value: val, label: option?.label || val };
                  });

                  return (
                    <div className='flex flex-wrap gap-1'>
                      {selectedOptions.map((option) => (
                        <span
                          key={option.value}
                          className='bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs'
                        >
                          {option.label}
                          <Button
                            type='button'
                            size='sm'
                            onClick={(e) => handleRemoveValue(option.value, e)}
                            className='hover:bg-primary-foreground/20 size-4 rounded-sm transition-colors hover:cursor-pointer'
                          >
                            ×
                          </Button>
                        </span>
                      ))}
                    </div>
                  );
                }

                return <span className='text-muted-foreground'>{placeholder}</span>;
              }}
            />
          </SelectTrigger>
          <SelectPositioner className='max-w-(--anchor-width) w-full'>
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
