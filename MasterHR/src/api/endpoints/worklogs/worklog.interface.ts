import type { GetType, QueriesSchemaToType } from '@/shared/interface';

export const WORKLOGS_SCHEMA_QUERIES = {
  StartDate: 'string',
  EndDate: 'string',
  UserId: 'string',
  ProjectId: 'string',
} as const;

export type BaseWorklogsQueries = QueriesSchemaToType<typeof WORKLOGS_SCHEMA_QUERIES>;

export type BaseWorklog = {
  userId: string;
  projectId: string;
  workDate: string;
  description?: string;
  spentMinutes: number;
};

export type GetWorklog = GetType<BaseWorklog>;

export type PostWorklog = BaseWorklog;
