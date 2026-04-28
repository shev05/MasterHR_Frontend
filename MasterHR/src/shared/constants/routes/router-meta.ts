import { Check, Folder, House, Tag, Users2 } from 'lucide-react';

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
      USERS: {
        path: '/users',
        label: 'Сотрудники',
        icon: Users2,
        dataId: 'users',
      },
      USER_DETAIL: {
        path: '/users/:userId',
        label: 'Сотрудник',
        icon: Users2,
      },
      PROJECT: {
        path: '/project',
        label: 'Проекты',
        icon: Folder,
      },
      PROJECT_DETAIL: {
        path: '/project/:projectId',
        label: 'Проект',
        icon: Folder,
      },
      TAGS: { path: '/tags', label: 'Теги', icon: Tag },
      USER_ACTIVATOR: {
        path: '/user-activator',
        label: 'Активация сотрудников',
        icon: Check,
        dataId: 'users-activator',
      },
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
