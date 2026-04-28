import * as Yup from 'yup';

import { requiredString } from '@/shared/lib';

export enum PROJECT_FIELDS {
  TITLE = 'title',
  DESCRIPTION = 'description',
  TAGS = 'tags',
  CUSTOMER = 'customer',
  TECHNICAL_TASK = 'technicalTask',
}

export const PROJECT_DEFAULT_VALUES = {
  [PROJECT_FIELDS.TITLE]: '',
  [PROJECT_FIELDS.DESCRIPTION]: '',
  [PROJECT_FIELDS.TAGS]: [],
  [PROJECT_FIELDS.CUSTOMER]: '',
  [PROJECT_FIELDS.TECHNICAL_TASK]: null,
};

const tagSchema = Yup.object({
  id: Yup.string().required('Выберите тег'),
  year: Yup.number().min(0),
  weight: Yup.number().min(0),
});

export const CREATE_PROJECT_SCHEMA = Yup.object({
  [PROJECT_FIELDS.TITLE]: requiredString(),
  [PROJECT_FIELDS.DESCRIPTION]: requiredString(),
  [PROJECT_FIELDS.TAGS]: Yup.array().of(tagSchema).default([]),
  [PROJECT_FIELDS.CUSTOMER]: requiredString(),
  [PROJECT_FIELDS.TECHNICAL_TASK]: Yup.mixed<File>().nullable().default(null),
});

export type CreateProjectFormValue = Yup.InferType<typeof CREATE_PROJECT_SCHEMA>;
