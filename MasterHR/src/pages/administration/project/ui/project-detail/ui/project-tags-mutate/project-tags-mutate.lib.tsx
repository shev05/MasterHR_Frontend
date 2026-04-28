import * as Yup from 'yup';

import type { ProjectTag } from '@/api/endpoints/project';

export enum PROJECT_TAGS_FIELDS {
  TAGS = 'tags',
}

const tagSchema = Yup.object({
  tag: Yup.object({
    value: Yup.string().required('Выберите тег'),
    label: Yup.string().default(''),
  }).required(),
  year: Yup.number().min(0),
  weight: Yup.number().min(0),
});

export const PROJECT_TAGS_DEFAULT_VALUES = {
  [PROJECT_TAGS_FIELDS.TAGS]: [],
};

export const createProjectTagsFormValues = (tags: ProjectTag['tags']) => {
  if (!tags) return undefined;

  return {
    [PROJECT_TAGS_FIELDS.TAGS]:
      tags.map((item) => ({
        tag: { value: item.id, label: item.title },
        year: item.year ?? 0,
        weight: item.weight ?? 0,
      })) || PROJECT_TAGS_DEFAULT_VALUES[PROJECT_TAGS_FIELDS.TAGS],
  };
};

export const PROJECT_TAGS_BASE_SCHEMA = Yup.object({
  [PROJECT_TAGS_FIELDS.TAGS]: Yup.array().of(tagSchema).default([]),
});

export type ProjectTagsFormValue = Yup.InferType<typeof PROJECT_TAGS_BASE_SCHEMA>;
