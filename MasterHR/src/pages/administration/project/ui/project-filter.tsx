import { AppFiltersContainer } from '@/shared/components/app-filters-container';
import { SearchInput } from '@/shared/components/controls/search-input';
import { VirtualCombobox } from '@/shared/components/controls';
import { useUserList } from '@/api/endpoints/user';
import { ALL_ELEMENTS_QUERY } from '@/shared/constants';
import { useTagsList } from '@/api/endpoints/tags';

import type { AppFiltersContainerProps } from '@/shared/components/app-filters-container';
import type { QuriesParamsType } from '@/shared/interface';
import type { FC } from 'react';
import type { ProjectQueries } from '@/api/endpoints/project';

type SecondLevelFiltersProps = QuriesParamsType<ProjectQueries>;

const SecondLevelFilters: FC<SecondLevelFiltersProps> = ({ filters, updateFilters }) => {
  const { options: usersOption, isPending: usersOptionArePending } = useUserList({
    queries: ALL_ELEMENTS_QUERY,
  });
  const { options: tagsOption, isPending: tagsOptionArePending } = useTagsList({
    queries: ALL_ELEMENTS_QUERY,
  });

  return (
    <>
      <VirtualCombobox
        label='Создатель'
        options={usersOption}
        disabled={usersOptionArePending}
        onValueChange={(option) => {
          updateFilters({ FilterByCreator: option?.value.toString() || undefined });
        }}
        value={usersOption?.find((item) => item.value == filters.FilterByCreator)}
      />
      <VirtualCombobox
        label='Тег'
        options={tagsOption}
        disabled={tagsOptionArePending}
        onValueChange={(option) => {
          updateFilters({ FiltredByTags: option?.value.toString() || undefined });
        }}
        value={tagsOption?.find((item) => item.value == filters.FiltredByTags)}
      />
    </>
  );
};

type ProjectFiltersProps = Omit<AppFiltersContainerProps, 'children' | 'firstLevelFilters'> &
  QuriesParamsType<ProjectQueries>;

export const ProjectFilters: FC<ProjectFiltersProps> = ({
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
          <SearchInput value={filters.SearchBy} onDebouncedChange={(value) => updateFilters({ SearchBy: value })} />
        </>
      }
    >
      <SecondLevelFilters filters={filters} updateFilters={updateFilters} />
    </AppFiltersContainer>
  );
};
