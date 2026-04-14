import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';
import { transformDataToOptions } from '@/shared/lib/transform-data-to-options';
import { queryClient } from '@/api/query-client';

import { userApi } from './user.api';

import type { GetUser, GetUserPaginatedResponse, UserQueries } from './user.interface';
import type { BaseQueryListHookProps, QueryOptions } from '@/shared/interface';

export const userKeys = getApiBaseKeys(API_ROUTES.ROOT_USER.absPath);

export const useUserList = (
  { queries = {} }: BaseQueryListHookProps<UserQueries> = {},
  queryOptions?: QueryOptions<GetUserPaginatedResponse, ReturnType<typeof userKeys.list>>
) => {
  const query = useQuery({
    queryKey: userKeys.list(queries),
    queryFn: ({ signal }) => userApi.getList(queries, signal),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });

  const options = transformDataToOptions(query?.data?.list, {
    asIdKey: 'id',
    asValueKey: 'id',
    asLabelKeys: 'email',
  });

  return {
    ...query,
    options,
  };
};

type QueryHookProps = {
  userId: GetUser['id'];
};

export const useUser = (
  { userId }: QueryHookProps,
  queryOptions?: QueryOptions<GetUser, ReturnType<typeof userKeys.detail>>
) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: ({ signal }) => userApi.get(userId, signal),
    ...queryOptions,
  });
};

export const UseMe = () => {
  return useQuery({
    queryKey: userKeys.base,
    queryFn: ({ signal }) => userApi.me(signal),
    placeholderData: keepPreviousData,
  });
};

export const UseExtractSkills = () => {
  return useMutation({
    mutationFn: userApi.resumeFile,
  });
};

export const useUserUpdate = () => {
  return useMutation({
    mutationFn: userApi.update,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.base });
    },
  });
};

export const useUserAvatarUpdate = () => {
  return useMutation({
    mutationFn: userApi.updateAvatar,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.base });
    },
  });
};
