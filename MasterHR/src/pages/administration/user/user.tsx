import { useNavigate } from 'react-router-dom';

import { USER_SCHEMA_QUERIES, useUserList, type GetUser } from '@/api/endpoints/user';
import { BASE_SCHEMA_QUERIES, DEFAULT_QUERIES, MESSAGE_API } from '@/shared/constants';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { AppPageHeader } from '@/shared/components/app-page-header';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { ErrorBoundaryFallback } from '@/shared/components/error-boundary-fallback';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { AppTable } from '@/shared/components/app-table';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';
import { parseApiErrors } from '@/api/http-client';
import { toast } from '@/shared/components/app-toaster';
import { useCancelUser } from '@/api/endpoints/user-activator';

import { getColumns } from './user.meta';

export function UserPage() {
  const navigate = useNavigate();

  const { controlledParams, updateParams } = useQueryParams({
    schema: { ...USER_SCHEMA_QUERIES, ...BASE_SCHEMA_QUERIES },
    defaultValues: { ...DEFAULT_QUERIES },
  });

  const { data: userList, isPending: userListIsPending } = useUserList({ queries: controlledParams });
  const { mutate: unactivate, isPending: unactivateIsPending } = useCancelUser();

  const handleViewUserPage = (user?: GetUser) => {
    if (!user?.id) return;
    navigate(ROUTES_META.ROOT_USER_DETAIL.generatePath({ userId: user.id }));
  };

  const handleDelete = (user?: GetUser) => {
    if (!user?.id) return;
    unactivate(user.id, {
      onSuccess: () => {
        toast.success(MESSAGE_API.unactivate_success);
      },
      onError: (error: Error) => parseApiErrors({ error }),
    });
  };
  return (
    <>
      <AppPageHeader icon={ROUTES_META.ROOT_USERS.icon} title={ROUTES_META.ROOT_USERS.label}>
        {/* <AddButton onClick={() => handleTagsMutate()}>Создать тег</AddButton> */}
      </AppPageHeader>
      <ErrorBoundary fallback={<ErrorBoundaryFallback text={PLACEHOLDERS.tableError} />}>
        <AppTable
          data={userList?.list}
          meta={userList?.meta}
          isDataFetching={userListIsPending || unactivateIsPending}
          columns={getColumns({ onView: handleViewUserPage, onDelete: handleDelete })}
          onPaginationParamsChange={(params) => updateParams(params, { withPaginationReset: false })}
          onSortingParamsChange={(params) => updateParams(params, { withPaginationReset: false })}
        />
      </ErrorBoundary>
    </>
  );
}
