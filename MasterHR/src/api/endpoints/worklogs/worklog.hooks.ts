import { keepPreviousData, useMutation, useQuery, type QueryOptions } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';
import { queryClient } from '@/api/query-client';

import { worklogApi } from './worklog.api';

import type { BaseWorklogsQueries, GetWorklog } from './worklog.interface';
import type { BaseQueryListHookProps } from '@/shared/interface';

const worklogKeys = getApiBaseKeys(API_ROUTES.ROOT_WORKLOGS.absPath);

export const useWorklogList = (
  { queries = {} }: BaseQueryListHookProps<BaseWorklogsQueries> = {},
  queryOptions?: QueryOptions<GetWorklog[], ReturnType<typeof worklogKeys.list>>
) => {
  return useQuery({
    queryKey: worklogKeys.list(queries),
    queryFn: ({ signal }) => worklogApi.getList(queries, signal),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};
export const useWorklogCreate = () => {
  return useMutation({
    mutationFn: worklogApi.create,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: worklogKeys.base });
    },
  });
};
