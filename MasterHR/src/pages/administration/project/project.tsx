import { useNavigate } from 'react-router-dom';

import { AppPageHeader } from '@/shared/components/app-page-header';
import { AppTable } from '@/shared/components/app-table';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { ErrorBoundaryFallback } from '@/shared/components/error-boundary-fallback';
import { BASE_SCHEMA_QUERIES, DEFAULT_QUERIES } from '@/shared/constants';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { PROJECT_SCHEMA_QUERIES, useProjectDelete, useProjectList } from '@/api/endpoints/project';
import { AddButton } from '@/shared/components/ui';
import { useDialog } from '@/providers';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';

import { getColumns } from './project.meta';
import { ProjectCreateDialog } from './ui/project-create-dialog';

import type { GetProject } from '@/api/endpoints/project';

export function ProjectPage() {
  const navigate = useNavigate();

  const { controlledParams, updateParams } = useQueryParams({
    schema: { ...PROJECT_SCHEMA_QUERIES, ...BASE_SCHEMA_QUERIES },
    defaultValues: { ...DEFAULT_QUERIES },
  });

  const { data: projectList, isPending: projectListIsPending } = useProjectList({ queries: controlledParams });
  const { mutate: deleteProject, isPending: deleteIsPending } = useProjectDelete();

  const handleViewProjectPage = (project?: GetProject) => {
    if (!project?.id) return;
    navigate(ROUTES_META.ROOT_ADMINISTRATION_PROJECT_PROJECT_ID.generatePath({ projectId: project.id }));
  };

  const { showDialog } = useDialog();

  const handleProjectCreate = () => {
    showDialog({
      getContent: (onClose) => <ProjectCreateDialog closeDialog={onClose} />,
    });
  };

  const handleProjectDelete = (project: GetProject) => {
    deleteProject(project?.id, {
      onSuccess: () => toast.success('Проект удален'),
      onError: (error) => parseApiErrors({ error }),
    });
  };

  return (
    <>
      <AppPageHeader
        icon={ROUTES_META.ROOT_ADMINISTRATION_PROJECT.icon}
        title={ROUTES_META.ROOT_ADMINISTRATION_PROJECT.label}
      >
        <AddButton onClick={() => handleProjectCreate()}>Создать проект</AddButton>
      </AppPageHeader>
      <ErrorBoundary fallback={<ErrorBoundaryFallback text={PLACEHOLDERS.tableError} />}>
        <AppTable
          data={projectList?.list}
          meta={projectList?.meta}
          isDataFetching={projectListIsPending || deleteIsPending}
          columns={getColumns({ onView: handleViewProjectPage, onDelete: handleProjectDelete })}
          onPaginationParamsChange={(params) => updateParams(params, { withPaginationReset: false })}
          onSortingParamsChange={(params) => updateParams(params, { withPaginationReset: false })}
        />
      </ErrorBoundary>
    </>
  );
}
