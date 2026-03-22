import * as Yup from 'yup';

import { partialArray, requiredString } from '@/shared/lib';

export enum PROJECT_FIELDS {
  TITLE = 'title',
  DESCRIPTION = 'description',
  TAGS = 'tags',
}

export const PROJECT_DEFAULT_VALUES = {
  [PROJECT_FIELDS.TITLE]: '',
  [PROJECT_FIELDS.DESCRIPTION]: '',
  [PROJECT_FIELDS.TAGS]: [],
};

export const CREATE_PROJECT_SCHEMA = Yup.object({
  [PROJECT_FIELDS.TITLE]: requiredString(),
  [PROJECT_FIELDS.DESCRIPTION]: requiredString(),
  [PROJECT_FIELDS.TAGS]: partialArray(),
});

export type CreateProjectFormValue = Yup.InferType<typeof CREATE_PROJECT_SCHEMA>;

// export const ROLE_OPTIONS = [
//   { value: 0, label: 'Работник' },
//   { value: 1, label: 'Менеджер' },
//   { value: 2, label: 'Админ' },
// ];
