import * as Yup from 'yup';

import { partialString, requiredNumber, requiredOption } from '@/shared/lib';

import type { OptionBase } from '@/shared/interface';

export type WorklogFormValue = {
  projectId: OptionBase;
  workDate: Date;
  spentMinutes: number;
  description?: string;
};

export enum WORKLOG_FIELDS {
  PROJECT_ID = 'projectId',
  WORK_DATE = 'workDate',
  SPENT_MINUTES = 'spentMinutes',
  DESCRIPTION = 'description',
}

export const WORKLOG_DEFAULT_VALUES = {
  [WORKLOG_FIELDS.PROJECT_ID]: null,
  [WORKLOG_FIELDS.WORK_DATE]: new Date(),
  [WORKLOG_FIELDS.SPENT_MINUTES]: 0,
  [WORKLOG_FIELDS.DESCRIPTION]: '',
};

export const createWorklogFormValues = (worklog?: WorklogFormValue) => {
  if (!worklog) return undefined;

  const project = worklog?.projectId
    ? {
        id: String(worklog.projectId.id ?? worklog.projectId.value),
        label: worklog.projectId.label,
        value: String(worklog.projectId.value),
      }
    : null;

  return {
    [WORKLOG_FIELDS.PROJECT_ID]: project || WORKLOG_DEFAULT_VALUES[WORKLOG_FIELDS.PROJECT_ID],
    [WORKLOG_FIELDS.WORK_DATE]: worklog.workDate || WORKLOG_DEFAULT_VALUES[WORKLOG_FIELDS.WORK_DATE],
    [WORKLOG_FIELDS.SPENT_MINUTES]: worklog.spentMinutes ?? WORKLOG_DEFAULT_VALUES[WORKLOG_FIELDS.SPENT_MINUTES],
    [WORKLOG_FIELDS.DESCRIPTION]: worklog.description || WORKLOG_DEFAULT_VALUES[WORKLOG_FIELDS.DESCRIPTION],
  };
};

export const WORKLOG_BASE_SCHEMA = Yup.object({
  [WORKLOG_FIELDS.PROJECT_ID]: requiredOption(),
  [WORKLOG_FIELDS.WORK_DATE]: Yup.date().required('Обязательное поле'),
  [WORKLOG_FIELDS.SPENT_MINUTES]: requiredNumber(),
  [WORKLOG_FIELDS.DESCRIPTION]: partialString(),
});

export type WorkLogFormValue = Yup.InferType<typeof WORKLOG_BASE_SCHEMA>;
