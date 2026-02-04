// import { userActions } from '@/store'

import type { AxiosInstance } from 'axios';
// import type { GetUser } from '@/api/endpoint'

// let refreshPromise: Promise<IApiResponse<GetUser>> | null = null

export const setupAuthInterceptors = (client: AxiosInstance, _apiUrl: string) => {
  client.interceptors.request.use((config) => config);

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // const requestUrl = originalRequest?.url || ''
      // const isAuthRequest = requestUrl.includes('authenticate')

      if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest._isRetry = true;

        // if (isAuthRequest) {
        //   userActions.deleteUser()
        //   window.location.href = EPaths.LOGIN
        //   return Promise.reject(error)
        // }

        // try {
        //   if (!refreshPromise) {
        //     refreshPromise = authApi.authenticate().finally(() => {
        //       refreshPromise = null
        //     })
        //   }

        //   const response = await refreshPromise

        //   if (response.data) {
        //     return client(originalRequest)
        //   }

        //   throw new Error('Authentication failed')
        // } catch {
        //   userActions.deleteUser()
        //   window.location.href = EPaths.LOGIN
        // }
      }

      return Promise.reject(error);
    }
  );
};
