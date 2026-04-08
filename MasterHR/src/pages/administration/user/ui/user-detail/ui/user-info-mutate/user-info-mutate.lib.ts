import * as Yup from 'yup';

import { requiredString } from '@/shared/lib';

import type { PutUser } from '@/api/endpoints/user';

export enum USER_INFO_FIELDS {
  NAME = 'name',
  SURNAME = 'surname',
  PATRONYMIC = 'patronymic',
  PHONE_NUMBER = 'phoneNumber',
  POSITION = 'position',
}

export const USER_INFO_DEFAULT_VALUES = {
  [USER_INFO_FIELDS.NAME]: '',
  [USER_INFO_FIELDS.SURNAME]: '',
  [USER_INFO_FIELDS.PATRONYMIC]: '',
  [USER_INFO_FIELDS.PHONE_NUMBER]: '',
  [USER_INFO_FIELDS.POSITION]: '',
};

export const createUserInfoFormValues = ({ name, surname, patronymic, phoneNumber, position }: PutUser) => {
  if (!name) return undefined;

  return {
    [USER_INFO_FIELDS.NAME]: name || USER_INFO_DEFAULT_VALUES[USER_INFO_FIELDS.NAME],
    [USER_INFO_FIELDS.SURNAME]: surname || USER_INFO_DEFAULT_VALUES[USER_INFO_FIELDS.SURNAME],
    [USER_INFO_FIELDS.PATRONYMIC]: patronymic || USER_INFO_DEFAULT_VALUES[USER_INFO_FIELDS.PATRONYMIC],
    [USER_INFO_FIELDS.PHONE_NUMBER]: phoneNumber || USER_INFO_DEFAULT_VALUES[USER_INFO_FIELDS.PHONE_NUMBER],
    [USER_INFO_FIELDS.POSITION]: position || USER_INFO_DEFAULT_VALUES[USER_INFO_FIELDS.POSITION],
  };
};

export const USER_INFO_BASE_SCHEMA = Yup.object({
  [USER_INFO_FIELDS.NAME]: requiredString(),
  [USER_INFO_FIELDS.SURNAME]: requiredString(),
  [USER_INFO_FIELDS.PATRONYMIC]: requiredString(),
  [USER_INFO_FIELDS.PHONE_NUMBER]: requiredString(),
  [USER_INFO_FIELDS.POSITION]: requiredString(),
});

export type UserInfoFormValue = Yup.InferType<typeof USER_INFO_BASE_SCHEMA>;
