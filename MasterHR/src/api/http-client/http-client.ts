import axios from 'axios';

export const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

import { API_ROUTES } from '@/api/api-routes';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';
import { removeIsAuth } from '@/store';

import { observerApi } from './interceptors.lib';
import { parseApiErrors } from './error-parser';

const LOGIN_PAGE_ROUTE = ROUTES_META.ROOT_LOGIN.absPath;
const API_REFRESH_TOKEN_PATH = API_ROUTES.ROOT_ACCOUNT_REFRESH_TOKEN.absPath;

export const ERROR_QUERY = 'code';

export const ERROR_CODES = {
  AUTH: 401,
};

export const httpClient = axios.create({
  withCredentials: true,
  baseURL: '/api',
});

httpClient.interceptors.request.use((config) => config);

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const logout = () => {
      removeIsAuth();
      window.location.href = LOGIN_PAGE_ROUTE;
    };

    if (
      error.response?.status === ERROR_CODES.AUTH &&
      originalRequest &&
      !originalRequest._isRetry &&
      originalRequest.url !== API_ROUTES.ROOT_ACCOUNT_LOGIN.absPath
    ) {
      if (originalRequest.url?.includes(API_REFRESH_TOKEN_PATH)) {
        logout();
        return Promise.reject(error);
      }

      if (!observerApi.isRefreshing) {
        originalRequest._isRetry = true;

        try {
          await httpClient.post(API_REFRESH_TOKEN_PATH, {}, { withCredentials: true });
          return httpClient(originalRequest);
        } catch {
          logout();
        }
      } else {
        return new Promise((resolve, reject) => {
          observerApi.subscribeToRefresh(() => {
            originalRequest._retry = true;
            httpClient(originalRequest).then(resolve).catch(reject);
          });
        });
      }
    } else {
      parseApiErrors({ error, isToastNeeded: true });
      return Promise.reject(error);
    }
  }
);
