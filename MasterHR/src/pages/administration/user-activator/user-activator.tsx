import {
  useActivateUser,
  useCancelUser,
  USER_ACTIVATOR_SCHEMA_QUERIES,
  useUserActivatorList,
  type GetUserActivator,
} from '@/api/endpoints/user-activator';
import { AppTable } from '@/shared/components/app-table';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { ErrorBoundaryFallback } from '@/shared/components/error-boundary-fallback';
import { BASE_SCHEMA_QUERIES, DEFAULT_QUERIES, MESSAGE_API } from '@/shared/constants';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';

import { getColumns } from './user-activator.meta';

export function UserActivatorPage() {
  const { controlledParams, updateParams } = useQueryParams({
    schema: { ...USER_ACTIVATOR_SCHEMA_QUERIES, ...BASE_SCHEMA_QUERIES },
    defaultValues: { ...DEFAULT_QUERIES },
  });

  const { data: userActivatorList, isPending: userActivatorListIsPending } = useUserActivatorList({
    queries: controlledParams,
  });

  const { mutate: activate, isPending: activateIsPending } = useActivateUser();
  const { mutate: unactivate, isPending: unactivateIsPending } = useCancelUser();

  const handleActivate = (user?: GetUserActivator) => {
    if (!user?.userId) return;
    activate(user.userId, {
      onSuccess: () => {
        toast.success(MESSAGE_API.activate_success);
      },
      onError: (error: Error) => parseApiErrors({ error }),
    });
  };

  const handleCancel = (user?: GetUserActivator) => {
    if (!user?.userId) return;
    unactivate(user.userId, {
      onSuccess: () => {
        toast.success(MESSAGE_API.unactivate_success);
      },
      onError: (error: Error) => parseApiErrors({ error }),
    });
  };

  return (
    <>
      <ErrorBoundary fallback={<ErrorBoundaryFallback text={PLACEHOLDERS.tableError} />}>
        <AppTable
          data={userActivatorList?.list}
          meta={userActivatorList?.meta}
          isDataFetching={userActivatorListIsPending || activateIsPending || unactivateIsPending}
          columns={getColumns({
            onAccept: handleActivate,
            onDelete: handleCancel,
          })}
          onPaginationParamsChange={(params) => updateParams(params, { withPaginationReset: false })}
          onSortingParamsChange={(params) => updateParams(params, { withPaginationReset: false })}
        />
      </ErrorBoundary>
    </>
  );
}
