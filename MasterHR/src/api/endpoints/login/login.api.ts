import { httpClient } from '@/api/http-client';
import { API_ROUTES } from '@/api/api-routes';

import type { AuthPayload, AuthResponse, RegisterPayload } from './login.interface';

export const loginApi = {
  login: async ({ email, password }: AuthPayload) => {
    const response = await httpClient.post<AuthPayload, AuthResponse>(API_ROUTES.ROOT_ACCOUNT_LOGIN.absPath, {
      email,
      password,
    });

    return response;
  },

  register: async (data: RegisterPayload) => {
    const response = await httpClient.post<RegisterPayload, void>(API_ROUTES.ROOT_ACCOUNT.absPath, { ...data });

    return response;
  },
};
