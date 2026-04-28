import type { ApiPaginatedResponse, ApiResponse, GetQueries, GetType, QueriesSchemaToType } from '@/shared/interface';
import type { GetUser } from '@/api/endpoints/user';
import type { GetTags } from '@/api/endpoints/tags';

export const PROJECT_SCHEMA_QUERIES = {
  SearchBy: 'string',
  FilterByCreator: 'string',
  FiltredByTags: 'string',
  ExceptUser: 'string',
} as const;

export type BaseProjectQueries = QueriesSchemaToType<typeof PROJECT_SCHEMA_QUERIES>;
export type ProjectQueries = GetQueries<BaseProjectQueries>;

export type BaseProjectTag = {
  id: GetTags['id'];
  title: GetTags['title'];
  year: number;
  weight: number;
};

export type ProjectTag = {
  title: string;
  tags: BaseProjectTag[];
};

export type BaseProject = {
  title: string;
  description: string;
  createdBy: GetUser;
  tags: BaseProjectTag[];
  users: Array<Omit<GetUser, 'role'> & { projectRole: number }>;
  canEdit: boolean;
  customer: string;
  technicalTask: string;
};

export type GetProject = GetType<BaseProject>;

export type GetUsersProject = Array<Omit<GetUser, 'role'> & { projectRole: number }>;

export type PostProjectTag = {
  id: GetTags['id'];
  year: number;
  weight: number;
};

export type PostProject = {
  title: GetProject['title'];
  description: GetProject['description'];
  tags: PostProjectTag[];
  customer: string;
  technicalTask: string;
};

export type PathcUsersProject = {
  users: Array<{ id: GetUser['id']; role: GetUser['role'] }>;
};

export type AddUserProject = {
  id: GetUser['id'];
  role: GetUser['role'];
};

export type PatchTagsProject = { tags: PostProjectTag[] };

export type PatchInfoProject = { title: string; description: string };

export type GetProjectResponse = ApiResponse<GetProject>;
export type GetProjectPaginatedResponse = ApiPaginatedResponse<GetProject>;
