import * as Yup from 'yup';

import { requiredArray } from '@/shared/lib';

import type { GetUsersProject } from '@/api/endpoints/project';

export enum PROJECT_USERS_FIELDS {
  USERS = 'users',
}

export const PROJECT_USERS_DEFAULT_VALUES = {
  [PROJECT_USERS_FIELDS.USERS]: [],
};

export const createProjectUsersFormValues = (users: GetUsersProject) => {
  if (!users) return undefined;

  return {
    [PROJECT_USERS_FIELDS.USERS]:
      users.map((user) => ({
        id: user.id,
        role: String(user.projectRole ?? 0),
      })) || PROJECT_USERS_DEFAULT_VALUES[PROJECT_USERS_FIELDS.USERS],
  };
};

export const PROJECT_USERS_BASE_SCHEMA = Yup.object({
  [PROJECT_USERS_FIELDS.USERS]: requiredArray().of(
    Yup.object({
      id: Yup.string().required('Пользователь обязателен'),
      role: Yup.string()
        .required('Роль обязательна')
        .test('is-valid-role', 'Некорректная роль', (value) => {
          return ['0', '1'].includes(value || '');
        }),
    })
  ),
});

export type ProjectUsersFormValue = Yup.InferType<typeof PROJECT_USERS_BASE_SCHEMA>;

export const ROLE_OPTIONS = [
  { value: '0', label: 'Работник' },
  { value: '1', label: 'Менеджер' },
];
