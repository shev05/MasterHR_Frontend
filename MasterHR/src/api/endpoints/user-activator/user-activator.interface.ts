import type { ApiPaginatedResponse, GetQueries, GetType, QueriesSchemaToType } from '@/shared/interface';

export const USER_ACTIVATOR_SCHEMA_QUERIES = {
  search: 'string',
} as const;

export type BaseUserActivatorQueries = QueriesSchemaToType<typeof USER_ACTIVATOR_SCHEMA_QUERIES>;
export type UserActivatorQueries = GetQueries<BaseUserActivatorQueries>;

export type BaseUserActivator = {
  userId: 'string';
  userName: 'string';
  userSurname: 'string';
  userPatronymic: 'string';
  userEmail: 'string';
};

export type GetUserActivator = GetType<BaseUserActivator>;

export type GetUserActivatorPaginatedResponse = ApiPaginatedResponse<GetUserActivator>;
