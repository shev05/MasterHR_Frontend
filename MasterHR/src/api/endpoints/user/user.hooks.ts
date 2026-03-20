import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';

import { userApi } from './user.api';

const userKeys = getApiBaseKeys(API_ROUTES.ROOT_USER.absPath);

export const UseMe = () => {
  return useQuery({
    queryKey: userKeys.base,
    queryFn: ({ signal }) => userApi.me(signal),
    placeholderData: keepPreviousData,
  });
};
