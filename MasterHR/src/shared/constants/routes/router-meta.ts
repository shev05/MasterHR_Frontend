import { Check, Component, House, ShieldUser, Tag } from 'lucide-react';

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
      ADMINISTRATION: {
        path: '/administration',
        label: 'Администрирование',
        icon: ShieldUser,
        children: {
          TAGS: { path: 'tags', label: 'Теги', icon: Tag },
          USER_ACTIVATOR: { path: 'user-activator', label: 'Активация пользователей', icon: Check },
        },
      },
      COMPONENTS: { path: '/components', label: 'Компоненты', icon: Component },
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
