import * as Yup from 'yup';

import { requiredArray } from '@/shared/lib';

import type { GetTags } from '@/api/endpoints/tags';

export enum PROJECT_TAGS_FIELDS {
  TAGS = 'tags',
}

export const PROJECT_TAGS_DEFAULT_VALUES = {
  [PROJECT_TAGS_FIELDS.TAGS]: [],
};

export const createProjectTagsFormValues = (tags: GetTags[]) => {
  if (!tags) return undefined;

  return {
    [PROJECT_TAGS_FIELDS.TAGS]:
      tags?.map((item) => ({
        id: item.id,
        value: item.title,
        label: item.title,
      })) || PROJECT_TAGS_DEFAULT_VALUES[PROJECT_TAGS_FIELDS.TAGS],
  };
};

export const PROJECT_TAGS_BASE_SCHEMA = Yup.object({
  [PROJECT_TAGS_FIELDS.TAGS]: requiredArray(),
});

export type ProjectTagsFormValue = Yup.InferType<typeof PROJECT_TAGS_BASE_SCHEMA>;
