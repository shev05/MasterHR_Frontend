import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { GetUserActivatorPaginatedResponse, UserActivatorQueries } from './user-activator.interface';

export const userActivatorApi = {
  getList: async ({ ...queries }: UserActivatorQueries, signal: AbortSignal) => {
    const response = await httpClient.get<GetUserActivatorPaginatedResponse>(API_ROUTES.ROOT_USER_ACTIVATOR.absPath, {
      params: queries,
      signal,
    });

    return response.data;
  },

  //   activate: async (userId)
};
