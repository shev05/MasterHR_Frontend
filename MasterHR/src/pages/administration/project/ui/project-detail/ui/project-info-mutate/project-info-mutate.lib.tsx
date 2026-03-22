import * as Yup from 'yup';

import { requiredString } from '@/shared/lib';

import type { GetProject } from '@/api/endpoints/project';

export enum PROJECT_INFO_FIELDS {
  TITLE = 'title',
  DESCRIPTION = 'description',
}

export const PROJECT_INFO_DEFAULT_VALUES = {
  [PROJECT_INFO_FIELDS.TITLE]: '',
  [PROJECT_INFO_FIELDS.DESCRIPTION]: '',
};

export const createProjectInfoFormValues = (title: GetProject['title'], description: GetProject['description']) => {
  if (!title && !description) return undefined;

  return {
    [PROJECT_INFO_FIELDS.TITLE]: title || PROJECT_INFO_DEFAULT_VALUES[PROJECT_INFO_FIELDS.TITLE],
    [PROJECT_INFO_FIELDS.DESCRIPTION]: description || PROJECT_INFO_DEFAULT_VALUES[PROJECT_INFO_FIELDS.DESCRIPTION],
  };
};

export const PROJECT_INFO_BASE_SCHEMA = Yup.object({
  [PROJECT_INFO_FIELDS.TITLE]: requiredString(),
  [PROJECT_INFO_FIELDS.DESCRIPTION]: requiredString(),
});

export type ProjectInfoFormValue = Yup.InferType<typeof PROJECT_INFO_BASE_SCHEMA>;
