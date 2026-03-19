import * as Yup from 'yup';

import { requiredString } from '@/shared/lib';

import type { GetTags } from '@/api/endpoints/tags';

export enum TAGS_FIELDS {
  TITLE = 'title',
}

export const TAGS_DEFAULT_VALUES = {
  [TAGS_FIELDS.TITLE]: '',
};

export const createTagsFormValues = (tags?: GetTags) => {
  if (!tags) return undefined;

  return {
    [TAGS_FIELDS.TITLE]: tags.title || TAGS_DEFAULT_VALUES[TAGS_FIELDS.TITLE],
  };
};

export const TAGS_BASE_SCHEMA = Yup.object({
  [TAGS_FIELDS.TITLE]: requiredString(),
});

export type TagsFormValue = Yup.InferType<typeof TAGS_BASE_SCHEMA>;
