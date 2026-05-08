import * as Yup from 'yup';

import { requiredString, VAL_MESSAGES } from '@/shared/lib';

export enum LOGIN_FIELDS {
  LOGIN = 'email',
  PASSWORD = 'password',
}

export const LOGIN_DEFAULT_VALUES = {
  [LOGIN_FIELDS.LOGIN]: '',
  [LOGIN_FIELDS.PASSWORD]: '',
};

export const LOGIN_FORM_SCHEMA = Yup.object({
  [LOGIN_FIELDS.LOGIN]: requiredString().max(50, VAL_MESSAGES.FIELD.MAX_SIZE('Логин', 50)),
  [LOGIN_FIELDS.PASSWORD]: requiredString(),
});

export type LoginFormValue = Yup.InferType<typeof LOGIN_FORM_SCHEMA>;
