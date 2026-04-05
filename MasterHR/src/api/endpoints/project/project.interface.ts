import type { ApiPaginatedResponse, ApiResponse, GetQueries, GetType, QueriesSchemaToType } from '@/shared/interface';
import type { GetUser } from '@/api/endpoints/user';
import type { GetTags } from '@/api/endpoints/tags';

export const PROJECT_SCHEMA_QUERIES = {
  search: 'string',
} as const;

export type BaseProjectQueries = QueriesSchemaToType<typeof PROJECT_SCHEMA_QUERIES>;
export type ProjectQueries = GetQueries<BaseProjectQueries>;

export type BaseProject = {
  title: string;
  description: string;
  createdBy: GetUser;
  tags: Array<GetTags>;
  users: Array<Omit<GetUser, 'role'> & { projectRole: number }>;
  canEdit: boolean;
};

export type GetProject = GetType<BaseProject>;

export type GetUsersProject = Array<Omit<GetUser, 'role'> & { projectRole: number }>;

export type PostProject = {
  title: GetProject['title'];
  description: GetProject['description'];
  tags: Array<GetTags['id']>;
};

export type PathcUsersProject = {
  users: Array<{ id: GetUser['id']; role: GetUser['role'] }>;
};

export type PatchTagsProject = { tags: Array<GetTags['id']> };

export type PatchInfoProject = { title: string; description: string };

export type GetProjectResponse = ApiResponse<GetProject>;
export type GetProjectPaginatedResponse = ApiPaginatedResponse<GetProject>;
