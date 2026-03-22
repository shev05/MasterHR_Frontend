import type { ApiPaginatedResponse, ApiResponse, GetQueries, GetType, QueriesSchemaToType } from '@/shared/interface';

export const USER_SCHEMA_QUERIES = {
  search: 'string',
} as const;

export type BaseUserQueries = QueriesSchemaToType<typeof USER_SCHEMA_QUERIES>;
export type UserQueries = GetQueries<BaseUserQueries>;

export type BaseUser = {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phoneNumber: string;
  position: string;
  role: number;
  avatar: string;
};

export type GetUser = GetType<BaseUser>;

export type GetUserResponse = ApiResponse<GetUser>;
export type GetUserPaginatedResponse = ApiPaginatedResponse<GetUser>;
