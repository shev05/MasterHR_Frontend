import * as Yup from 'yup';

import { requiredNumber, requiredString } from '@/shared/lib';

export enum SKILLS_FIELDS {
  NAME = 'name',
  LEVEL = 'level',
  YEARS = 'years',
}

export const SKILLS_FIELDS_DEFAULT_VALUES = {
  [SKILLS_FIELDS.NAME]: '',
  [SKILLS_FIELDS.LEVEL]: '',
  [SKILLS_FIELDS.YEARS]: 0,
};

export const CREATE_SKILLS_FIELDS_SCHEMA = Yup.object({
  [SKILLS_FIELDS.NAME]: requiredString(),
  [SKILLS_FIELDS.LEVEL]: requiredString(),
  [SKILLS_FIELDS.YEARS]: requiredNumber('Поле должно содержать число'),
});

export type CreateUserSkillsFormValue = Yup.InferType<typeof CREATE_SKILLS_FIELDS_SCHEMA>;
