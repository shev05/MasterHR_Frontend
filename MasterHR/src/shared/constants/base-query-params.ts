import { OrderDirection } from '@/shared/interface';

import { TABLE_PER_PAGE_OPTIONS } from './options';

export const BASE_SCHEMA_QUERIES = {
  pageNumber: 'number',
  pageSize: 'number',
  sort_by: 'string',
  sort_direction: OrderDirection,
} as const;

export const DEFAULT_QUERIES = {
  pageNumber: 1,
  pageSize: Number(TABLE_PER_PAGE_OPTIONS[0].value),
};

export const ALL_ELEMENTS_QUERY = {
  pageSize: -1,
};
