import { TAGS_SCHEMA_QUERIES, type GetTags } from '@/api/endpoints/tags';
import { useTagDelete, useTagsList } from '@/api/endpoints/tags';
import { AppPageHeader } from '@/shared/components/app-page-header';
import { AppTable } from '@/shared/components/app-table';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { ErrorBoundaryFallback } from '@/shared/components/error-boundary-fallback';
import { BASE_SCHEMA_QUERIES, DEFAULT_QUERIES } from '@/shared/constants';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';
import { useDialog } from '@/providers';
import { AddButton } from '@/shared/components/ui';

import { getColumns } from './tags.meta';
import { TagsMutateDialog } from './ui/tags-mutate-dialog';
import { SearchFilters } from './ui';

export function TagsPage() {
  const { controlledParams, updateParams, appliedFiltersCount, resetFilters } = useQueryParams({
    schema: { ...TAGS_SCHEMA_QUERIES, ...BASE_SCHEMA_QUERIES },
    defaultValues: { ...DEFAULT_QUERIES },
  });

  const { data: tagsList, isPending: tagsListIsPending } = useTagsList({ queries: controlledParams });
  const { mutate: deleteTag, isPending: deleteTagIsPending } = useTagDelete();

  const { showDialog } = useDialog();

  const handleTagsMutate = (tags?: GetTags) => {
    showDialog({
      getContent: (onClose) => <TagsMutateDialog closeDialog={onClose} tagId={tags?.id} />,
    });
  };

  const handleTagsDelete = (labOrder: GetTags) => {
    deleteTag(labOrder?.id, {
      onSuccess: (response) => toast.success(response.message),
      onError: (error) => parseApiErrors({ error }),
    });
  };
  return (
    <>
      <AppPageHeader
        icon={ROUTES_META.ROOT_ADMINISTRATION_TAGS.icon}
        title={ROUTES_META.ROOT_ADMINISTRATION_TAGS.label}
      >
        <AddButton onClick={() => handleTagsMutate()}>Создать пациента</AddButton>
      </AppPageHeader>
      <ErrorBoundary fallback={<ErrorBoundaryFallback text={PLACEHOLDERS.filtersError} />}>
        <SearchFilters
          filters={controlledParams}
          updateFilters={updateParams}
          appliedFiltersCount={appliedFiltersCount}
          onFiltersReset={resetFilters}
        />
      </ErrorBoundary>
      <ErrorBoundary fallback={<ErrorBoundaryFallback text={PLACEHOLDERS.tableError} />}>
        <AppTable
          data={tagsList?.list}
          meta={tagsList?.meta}
          isDataFetching={tagsListIsPending || deleteTagIsPending}
          columns={getColumns({
            onDelete: handleTagsDelete,
          })}
          onPaginationParamsChange={(params) => updateParams(params, { withPaginationReset: false })}
          onSortingParamsChange={(params) => updateParams(params, { withPaginationReset: false })}
        />
      </ErrorBoundary>
    </>
  );
}
