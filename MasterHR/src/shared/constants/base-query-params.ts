
import { OrderDirection } from '@/shared/interface';

import { TABLE_PER_PAGE_OPTIONS } from './options';

export const BASE_SCHEMA_QUERIES = {
  page: 'number',
  per_page: 'number',
  sort_by: 'string',
  sort_direction: OrderDirection,
} as const;

export const DEFAULT_QUERIES = {
  page: 1,
  per_page: Number(TABLE_PER_PAGE_OPTIONS[0].value),
};

export const ALL_ELEMENTS_QUERY = {
  per_page: -1,
};
