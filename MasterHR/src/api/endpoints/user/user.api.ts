import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { GetUser, GetUserPaginatedResponse, UserQueries } from './user.interface';

export const userApi = {
  getList: async ({ ...queries }: UserQueries, signal: AbortSignal) => {
    const response = await httpClient.get<GetUserPaginatedResponse>(API_ROUTES.ROOT_USER.absPath, {
      params: queries,
      signal,
    });

    return response.data;
  },

  get: async (userId: GetUser['id'], signal: AbortSignal) => {
    const response = await httpClient.get<GetUser>(API_ROUTES.ROOT_USER_USERID_PROFILE.generatePath({ userId }), {
      signal,
    });

    return response.data;
  },

  me: async (signal: AbortSignal) => {
    const response = await httpClient.get<GetUser>(API_ROUTES.ROOT_USER_ME.absPath, {
      signal,
    });

    return response.data;
  },
};
