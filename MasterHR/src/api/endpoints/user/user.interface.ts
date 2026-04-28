import type { ApiPaginatedResponse, ApiResponse, GetQueries, GetType, QueriesSchemaToType } from '@/shared/interface';
import type { GetProject } from '@/api/endpoints/project';

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
  canEdit: boolean;
};

export type GetUser = GetType<BaseUser>;

export type GetExtractSkills = {
  skills: Array<{ name: string; level: string; years: number }>;
  total_found: number;
};

export type PutUser = {
  name: string;
  surname: string;
  patronymic: string;
  position: string;
  phoneNumber: string;
};

export type MatchProject = {
  userId: string;
  projectIds: GetProject['id'][];
  minScorePercent: number;
};

export type MatchProjectRepsonse = {
  projectId: string;
  projectName: string;
  reason: string[];
  score: number;
}[];

export type GetUserResponse = ApiResponse<GetUser>;
export type GetUserPaginatedResponse = ApiPaginatedResponse<GetUser>;
