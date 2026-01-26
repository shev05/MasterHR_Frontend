import { z } from 'zod';

import { minMessage } from '@/shared/lib';

export enum LOGIN_FIELDS {
  LOGIN = 'login',
  PASSWORD = 'password',
}

export const LOGIN_DEFAULT_VALUES = {
  [LOGIN_FIELDS.LOGIN]: '',
  [LOGIN_FIELDS.PASSWORD]: '',
};

export const LOGIN_FORM_SCHEMA = z.object({
  [LOGIN_FIELDS.LOGIN]: z.string().min(2, { message: minMessage(2) }),
  [LOGIN_FIELDS.PASSWORD]: z.string().min(2, { message: minMessage(2) }),
});
