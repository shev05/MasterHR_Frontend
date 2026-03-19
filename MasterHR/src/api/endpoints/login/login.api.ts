import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { AuthPayload, AuthResponse } from './login.interface';

export const loginApi = {
  login: async ({ login, password }: AuthPayload) => {
    const response = await httpClient.post<AuthPayload, AuthResponse>(API_ROUTES.ROOT_ACCOUNT_LOGIN.absPath, {
      login,
      password,
    });

    return response;
  },
};
