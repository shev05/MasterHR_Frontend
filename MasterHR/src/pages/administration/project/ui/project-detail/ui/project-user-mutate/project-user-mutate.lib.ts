import * as Yup from 'yup';

import { requiredArray } from '@/shared/lib';

import type { GetUsersProject } from '@/api/endpoints/project';
import type { OptionBase } from '@/shared/interface';

export enum PROJECT_USERS_FIELDS {
  USERS = 'users',
}

export const PROJECT_USERS_DEFAULT_VALUES = {
  [PROJECT_USERS_FIELDS.USERS]: [],
};

export const createProjectUsersFormValues = (
  users: GetUsersProject,
  userOptions: OptionBase[]
): ProjectUsersFormValue => {
  if (!users?.length) {
    return PROJECT_USERS_DEFAULT_VALUES as ProjectUsersFormValue;
  }

  return {
    [PROJECT_USERS_FIELDS.USERS]: users.map((user) => {
      const userOption = userOptions.find((opt) => opt.value === user.id);

      return {
        id: userOption || { value: '', label: '' },
        role: String(user.projectRole ?? 0),
      };
    }),
  } as ProjectUsersFormValue;
};

export const PROJECT_USERS_BASE_SCHEMA = Yup.object({
  [PROJECT_USERS_FIELDS.USERS]: requiredArray().of(
    Yup.object({
      id: Yup.object({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
        .required('Сотрудник обязателен')
        .test('is-valid-user', 'Выберите Сотрудник', (value) => {
          return value?.value !== '';
        }),
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
