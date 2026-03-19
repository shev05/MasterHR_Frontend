import { appendErrors, get, set } from 'react-hook-form';

import type { Field, FieldError, FieldErrors, FieldValues, Ref, Resolver, ResolverOptions } from 'react-hook-form';
import type * as Yup from 'yup';
import type { AnyObject, ObjectSchema, ValidationError } from 'yup';

const setCustomValidity = (ref: Ref, fieldPath: string, errors: FieldErrors) => {
  if (ref && 'reportValidity' in ref) {
    const error = get(errors, fieldPath) as FieldError | undefined;
    ref.setCustomValidity((error && error.message) || '');

    ref.reportValidity();
  }
};

export const validateFieldsNatively = <TFieldValues extends FieldValues>(
  errors: FieldErrors,
  options: ResolverOptions<TFieldValues>
): void => {
  for (const fieldPath in options.fields) {
    const field = options.fields[fieldPath];
    if (field && field.ref && 'reportValidity' in field.ref) {
      setCustomValidity(field.ref, fieldPath, errors);
    } else if (field.refs) {
      field.refs.forEach((ref: HTMLInputElement) => setCustomValidity(ref, fieldPath, errors));
    }
  }
};

export const toNestError = <TFieldValues extends FieldValues>(
  errors: FieldErrors,
  options: ResolverOptions<TFieldValues>
): FieldErrors<TFieldValues> => {
  if (options.shouldUseNativeValidation) {
    validateFieldsNatively(errors, options);
  }

  const fieldErrors = {} as FieldErrors<TFieldValues>;
  for (const path in errors) {
    const field = get(options.fields, path) as Field['_f'] | undefined;

    set(fieldErrors, path, Object.assign(errors[path] || {}, { ref: field && field.ref }));
  }

  return fieldErrors;
};

const parseErrorSchema = (errors: Yup.ValidationError, validateAllFieldCriteria: boolean) => {
  return (errors.inner || []).reduce<Record<string, FieldError>>((previous, error) => {
    if (!previous[error.path!]) {
      previous[error.path!] = { message: error.message, type: error.type! };
    }

    if (validateAllFieldCriteria) {
      const types = previous[error.path!].types;
      const messages = types && types[error.type!];

      previous[error.path!] = appendErrors(
        error.path!,
        validateAllFieldCriteria,
        previous,
        error.type!,
        messages ? ([] as string[]).concat(messages as string[], error.message) : error.message
      ) as FieldError;
    }

    return previous;
  }, {});
};

interface IParams {
  validationSchema: ObjectSchema<AnyObject>;
}

export const yupCustomResolver = <ValuesTypes extends AnyObject>({
  validationSchema,
}: IParams): Resolver<ValuesTypes> => {
  return async (data: ValuesTypes, context, options) => {
    try {
      const values = await validationSchema.validate(data, {
        abortEarly: false,
        context,
      });

      return {
        values: values as ValuesTypes,
        errors: {},
      };
    } catch (errors) {
      const validationErrors = errors as ValidationError;

      return {
        values: {},
        errors: toNestError(
          parseErrorSchema(validationErrors, !options.shouldUseNativeValidation && options.criteriaMode === 'all'),
          options
        ),
      };
    }
  };
};
