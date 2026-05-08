import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';
import { queryClient } from '@/api/query-client';
import { userKeys } from '@/api/endpoints/user';

import { userActivatorApi } from './user-activator.api';

import type { BaseQueryListHookProps, QueryOptions } from '@/shared/interface';
import type { GetUserActivatorPaginatedResponse, UserActivatorQueries } from './user-activator.interface';

const userActivatorKeys = getApiBaseKeys(API_ROUTES.ROOT_USER_ACTIVATOR.absPath);

export const useUserActivatorList = (
  { queries = {} }: BaseQueryListHookProps<UserActivatorQueries> = {},
  queryOptions?: QueryOptions<GetUserActivatorPaginatedResponse, ReturnType<typeof userActivatorKeys.list>>
) => {
  return useQuery({
    queryKey: userActivatorKeys.list(queries),
    queryFn: ({ signal }) => userActivatorApi.getList(queries, signal),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};

export const useActivateUser = () => {
  return useMutation({
    mutationFn: userActivatorApi.activate,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userActivatorKeys.base });
    },
  });
};

export const useCancelUser = () => {
  return useMutation({
    mutationFn: userActivatorApi.deactivate,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userActivatorKeys.base });
      queryClient.invalidateQueries({ queryKey: userKeys.base });
    },
  });
};
