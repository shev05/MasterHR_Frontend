import type { ApiPaginatedResponse, ApiResponse, GetQueries, GetType, QueriesSchemaToType } from '@/shared/interface';

export const TAGS_SCHEMA_QUERIES = {
  search: 'string',
} as const;

export type BaseTagsQueries = QueriesSchemaToType<typeof TAGS_SCHEMA_QUERIES>;
export type TagsQueries = GetQueries<BaseTagsQueries>;

export type BaseTags = {
  title: string;
};

export type GetTags = GetType<BaseTags>;
export type PostTags = BaseTags;

export type GetTagsResponse = ApiResponse<GetTags>;
export type GetTagsPaginatedResponse = ApiPaginatedResponse<GetTags>;
