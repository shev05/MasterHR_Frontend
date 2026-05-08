import * as Yup from 'yup';

import { requiredString, VAL_MESSAGES, VAL_REGEXP } from '@/shared/lib';

export enum REGISTER_FIELDS {
  NAME = 'name',
  SURNAME = 'surname',
  PATRONYMC = 'patronymic',
  PASSWORD = 'password',
  EMAIL = 'email',
  PHONENUMBER = 'phoneNumber',
}

export const REGISTER_DEFAULT_VALUES = {
  [REGISTER_FIELDS.NAME]: '',
  [REGISTER_FIELDS.SURNAME]: '',
  [REGISTER_FIELDS.PATRONYMC]: '',
  [REGISTER_FIELDS.PASSWORD]: '',
  [REGISTER_FIELDS.EMAIL]: '',
  [REGISTER_FIELDS.PHONENUMBER]: '',
};

export const REGISTER_FORM_SCHEMA = Yup.object({
  [REGISTER_FIELDS.NAME]: requiredString(),
  [REGISTER_FIELDS.EMAIL]: requiredString().matches(VAL_REGEXP.AUTH.EMAIL, VAL_MESSAGES.AUTH.EMAIL),
  [REGISTER_FIELDS.SURNAME]: requiredString(),
  [REGISTER_FIELDS.PASSWORD]: requiredString(),
  [REGISTER_FIELDS.PATRONYMC]: requiredString(),
  [REGISTER_FIELDS.PHONENUMBER]: requiredString(),
});

export type RegisterFormValue = Yup.InferType<typeof REGISTER_FORM_SCHEMA>;
