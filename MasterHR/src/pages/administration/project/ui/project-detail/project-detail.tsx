import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Pencil, Users } from 'lucide-react';

import { useProject } from '@/api/endpoints/project';
import { AppPageHeader } from '@/shared/components/app-page-header';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SuspenseWrapper,
} from '@/shared/components/ui';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';
import { sFormat } from '@/shared/lib';
import { roleUser } from '@/shared/constants/role-user';
import { useDialog } from '@/providers';

import { ProjectTagsMutateDialog } from './ui/project-tags-mutate';
import { ProjectInfoMutateDialog } from './ui/project-info-mutate';
import { ProjectUsersMutateDialog } from './ui/project-user-mutate';

import type { GetProject } from '@/api/endpoints/project';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: GetProject['id'] }>();
  const navigate = useNavigate();

  const { data: project, isPending: projectIsPending } = useProject({ projectId: projectId || '' });

  const { showDialog } = useDialog();

  const handleProjectInfoMutate = () => {
    showDialog({
      getContent: (onClose) => (
        <ProjectInfoMutateDialog
          closeDialog={onClose}
          title={project?.title || ''}
          description={project?.description || ''}
          projectId={projectId!}
        />
      ),
    });
  };

  const handleProjectTagsMutate = () => {
    showDialog({
      getContent: (onClose) => <ProjectTagsMutateDialog closeDialog={onClose} projectId={projectId!} />,
    });
  };

  const handleProjectUsersMutate = () => {
    showDialog({
      getContent: (onClose) => <ProjectUsersMutateDialog closeDialog={onClose} projectId={projectId!} />,
    });
  };

  const canEdit = project?.canEdit;

  return (
    <>
      <AppPageHeader className='mb-2'>
        <Button variant='ghost' size='sm' onClick={() => navigate(ROUTES_META.ROOT_ADMINISTRATION_PROJECT.absPath)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Назад к проектам
        </Button>
      </AppPageHeader>
      <SuspenseWrapper condition={!projectIsPending}>
        <div className='space-y-6'>
          <Card>
            <CardHeader className='pb-0'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-2xl font-bold leading-tight'>{project?.title}</CardTitle>
                  {project?.description && (
                    <CardDescription className='text-base leading-relaxed'>{project?.description}</CardDescription>
                  )}
                </div>
                {canEdit && (
                  <Button variant='outline' size='sm' className='ml-2 h-8 w-8 p-0' onClick={handleProjectInfoMutate}>
                    <Pencil className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  {project?.tags && project.tags.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {project.tags.map((tag) => (
                        <Badge key={tag.id} variant='secondary' className='px-2 py-1 text-xs'>
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-sm italic'>Нет тегов</p>
                  )}
                </div>
                {canEdit && (
                  <Button variant='outline' size='sm' className='ml-2 h-8 w-8 p-0' onClick={handleProjectTagsMutate}>
                    <Pencil className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                  <Users className='h-5 w-5' />
                  Участники проекта
                </CardTitle>
                {canEdit && (
                  <Button variant='outline' size='sm' className='ml-2 h-8 w-8 p-0' onClick={handleProjectUsersMutate}>
                    <Pencil className='h-4 w-4' />
                  </Button>
                )}
              </div>
              <CardDescription className='mt-1 text-sm'>
                {project?.users?.length || 0} участников в проекте
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project?.users && project.users.length > 0 ? (
                <div className='space-y-3'>
                  {project.users.map((user) => (
                    <div key={user.id} className='flex items-center justify-between border-b py-2 last:border-0'>
                      <div className='flex min-w-0 flex-1 items-center gap-3'>
                        <Avatar className='h-10 w-10 flex-shrink-0'>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className='text-sm'>
                            {user.name?.charAt(0).toUpperCase()}
                            {user.surname?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium'>
                            {user.name} {user.surname}
                            {user.patronymic && ` ${user.patronymic}`}
                          </p>
                          <p className='text-muted-foreground truncate text-xs'>{user.email}</p>
                        </div>
                      </div>
                      <Badge variant='outline' className='ml-3 shrink-0 text-xs'>
                        {roleUser[user.projectRole || 0]}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground py-4 text-center text-sm italic'>Нет участников</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-0'>
              <CardTitle className='text-lg font-semibold'>Дополнительная информация</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 py-0'>
              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='text-muted-foreground h-4 w-4 flex-shrink-0' />
                <span className='text-muted-foreground'>Создан:</span>
                <span className='font-medium'>{sFormat(project?.createdAt || '')}</span>
              </div>

              <div className='flex items-center gap-3 pt-2'>
                <Avatar className='h-12 w-12 flex-shrink-0'>
                  <AvatarImage src={project?.createdBy.avatar} />
                  <AvatarFallback className='text-sm'>
                    {project?.createdBy.name?.charAt(0).toUpperCase()}
                    {project?.createdBy.surname?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>
                    {project?.createdBy.name} {project?.createdBy.surname}
                    {project?.createdBy.patronymic && ` ${project?.createdBy.patronymic}`}
                  </p>
                  <p className='text-muted-foreground truncate text-xs'>{project?.createdBy.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SuspenseWrapper>
    </>
  );
}
