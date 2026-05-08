import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type {
  GetUserActivator,
  GetUserActivatorPaginatedResponse,
  UserActivatorQueries,
} from './user-activator.interface';

export const userActivatorApi = {
  getList: async ({ ...queries }: UserActivatorQueries, signal: AbortSignal) => {
    const response = await httpClient.get<GetUserActivatorPaginatedResponse>(API_ROUTES.ROOT_USER_ACTIVATOR.absPath, {
      params: queries,
      signal,
    });

    return response.data;
  },

  activate: async (userId: GetUserActivator['id']) => {
    const response = await httpClient.post<null>(
      API_ROUTES.ROOT_USER_ACTIVATOR_USER_ID_ACTIVATE_USER.generatePath({ userId })
    );

    return response.data;
  },

  deactivate: async (userId: GetUserActivator['id']) => {
    const response = await httpClient.post<null>(
      API_ROUTES.ROOT_USER_ACTIVATOR_USER_ID_CANCEL_USER.generatePath({ userId })
    );

    return response.data;
  },
};
