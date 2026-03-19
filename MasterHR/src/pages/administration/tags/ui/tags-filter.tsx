import { AppFiltersContainer } from '@/shared/components/app-filters-container';
import { SearchInput } from '@/shared/components/controls/search-input';

import type { TagsQueries } from '@/api/endpoints/tags';
import type { AppFiltersContainerProps } from '@/shared/components/app-filters-container';
import type { QuriesParamsType } from '@/shared/interface';
import type { FC } from 'react';

type SearchFiltersProps = Omit<AppFiltersContainerProps, 'children' | 'firstLevelFilters'> &
  QuriesParamsType<TagsQueries>;

export const SearchFilters: FC<SearchFiltersProps> = ({
  appliedFiltersCount,
  onFiltersReset,
  updateFilters,
  filters,
}) => {
  return (
    <AppFiltersContainer
      appliedFiltersCount={appliedFiltersCount}
      onFiltersReset={onFiltersReset}
      firstLevelFilters={
        <>
          <SearchInput value={filters.search} onDebouncedChange={(value) => updateFilters({ search: value })} />
        </>
      }
    />
  );
};
