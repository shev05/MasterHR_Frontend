import { useMutation } from '@tanstack/react-query';

import { API_ROUTES } from '@/api/api-routes';
import { getApiBaseKeys } from '@/shared/lib';

import { loginApi } from './login.api';

const loginKeys = getApiBaseKeys(API_ROUTES.ROOT_ACCOUNT_LOGIN.absPath);

export const useLogin = () => {
  return useMutation({
    mutationKey: loginKeys.base,
    mutationFn: loginApi.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: loginKeys.base,
    mutationFn: loginApi.register,
  });
};
