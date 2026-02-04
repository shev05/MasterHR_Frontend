import { toast } from 'sonner';

import type { AxiosError } from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

type ApiError<T> = AxiosError<{
  data: Array<{ param: Path<T>; message: string }>;
  message: string;
  isToastNeeded?: boolean;
}>;

type ParseApiErrorsProps<T extends FieldValues> = {
  error: Error;
  setError?: UseFormSetError<T>;
  isToastNeeded?: boolean;
};

export const parseApiErrors = <T extends FieldValues>({
  error,
  setError,
  isToastNeeded = false,
}: ParseApiErrorsProps<T>) => {
  const typedError = error as ApiError<T>;

  const fieldErrors = typedError.response?.data.data || [];
  const errorMessage = typedError.response?.data.message;

  if (fieldErrors.length) {
    fieldErrors.map(({ param, message }) => {
      setError?.(param, { type: 'custom', message }, { shouldFocus: true });
    });
  } else {
    if (!isToastNeeded) return;

    errorMessage && toast.error(errorMessage);
  }
};
