import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { GetUser } from './user.interface';

export const userApi = {
  me: async (signal: AbortSignal) => {
    const response = await httpClient.get<GetUser>(API_ROUTES.ROOT_USER_ME.absPath, {
      signal,
    });

    return response.data;
  },
};
