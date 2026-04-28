import * as Yup from 'yup';

import { requiredNumber } from '@/shared/lib';

export enum USER_MATCH_FIELDS {
  MIN_SCORE_PERCENT = 'minScorePercent',
}

export const USER_MATCH_FIELDS_DEFAULT_VALUES = {
  [USER_MATCH_FIELDS.MIN_SCORE_PERCENT]: 50,
};

export const CREATE_USER_MATCH_FIELDS_SCHEMA = Yup.object({
  [USER_MATCH_FIELDS.MIN_SCORE_PERCENT]: requiredNumber('Процент не может быть 0'),
});

export type CreateUserMatchFormValue = Yup.InferType<typeof CREATE_USER_MATCH_FIELDS_SCHEMA>;
