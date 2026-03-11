import { House } from 'lucide-react';

import { asTransformedRoutes } from '@/shared/builders';

import type { RouteHandle } from './authenticated-routes';
import type { RouteHierarchyTransformedType } from '@/shared/builders';

export const ROUTES_META = asTransformedRoutes({
  ROOT: {
    path: '/',
    label: '',
    children: {
      LOGIN: {
        path: 'login',
      },
      NOT_FOUND: {
        path: '*',
        label: 'Страница не найдена',
      },
      HOME: { path: '/home', label: 'Главная. страница', icon: House },
    },
  },
} as const);

export const getMetaByKey = <T extends keyof RouteHandle>(
  routeMeta: RouteHierarchyTransformedType,
  keys: T[] = ['icon', 'label', 'permissions', 'dataId'] as T[]
): Pick<RouteHandle, T> => {
  const result = {} as Pick<RouteHandle, T>;

  for (const key of keys) {
    Object.assign(result, { [key]: routeMeta[key] });
  }

  return result;
};
