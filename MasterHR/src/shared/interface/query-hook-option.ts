import type { UseQueryOptions } from '@tanstack/react-query';

export type QueryOptions<TData, TQueryKey extends readonly unknown[]> = Omit<
  UseQueryOptions<TData, Error, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>;
