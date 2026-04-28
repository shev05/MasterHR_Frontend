import { Building2, Calendar, FileText } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';
import { API_BASE_URL } from '@/api/http-client';
import { roleUser } from '@/shared/constants/role-user';
import { sFormat } from '@/shared/lib';
import { getLevelColor } from '@/pages/administration/project/ui/project-detail/project-detail.lib';
import { useProject } from '@/api/endpoints/project';

import type { BaseDialogProps } from '@/shared/interface';
import type { FC } from 'react';
import type { GetProject } from '@/api/endpoints/project';

type ProjectInfoViewDialogProps = BaseDialogProps & {
  projectId: GetProject['id'];
};

export const ProjectInfoViewDialog: FC<ProjectInfoViewDialogProps> = ({ closeDialog, projectId }) => {
  const { data: project } = useProject({ projectId });

  return (
    <Dialog onOpenChange={closeDialog} open>
      <DialogContent className='max-w-5xl'>
        <DialogHeader>
          <DialogTitle>{project?.title}</DialogTitle>
          {project?.description && <DialogDescription>{project.description}</DialogDescription>}
        </DialogHeader>

        <DialogBody className='space-y-4'>
          {project?.tags && project.tags.length > 0 && (
            <div>
              <h4 className='mb-2 text-sm font-medium'>Теги</h4>
              <div className='flex flex-wrap gap-2'>
                {project.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getLevelColor(tag.year)}`}
                  >
                    <span>{tag.title}</span>
                    <span className='opacity-75'>
                      {tag.year} {tag.year === 1 ? 'год' : tag.year < 5 ? 'года' : 'лет'}
                    </span>
                    {tag.weight > 0 && (
                      <span className='rounded-full bg-white/50 px-1.5 py-0.5 text-[10px] font-semibold'>
                        {Math.round(tag.weight * 100)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {project?.users && project.users.length > 0 && (
            <div>
              <h4 className='mb-2 text-sm font-medium'>Участники ({project.users.length})</h4>
              <div className='space-y-2'>
                {project.users.map((user) => (
                  <div key={user.id} className='flex items-center gap-3 border-b py-2 last:border-0'>
                    <Avatar className='h-10 w-10 flex-shrink-0'>
                      <AvatarImage src={`${API_BASE_URL}${user?.avatar}`} />
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
                    <Badge variant='outline' className='shrink-0 text-xs'>
                      {roleUser[user.projectRole || 0]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project?.customer && (
            <div className='flex items-center gap-2 text-sm'>
              <Building2 className='text-muted-foreground h-4 w-4 flex-shrink-0' />
              <span className='text-muted-foreground'>Заказчик:</span>
              <span className='font-medium'>{project.customer}</span>
            </div>
          )}

          {project?.technicalTask && (
            <div className='flex items-center gap-2 text-sm'>
              <FileText className='text-muted-foreground h-4 w-4 flex-shrink-0' />
              <span className='text-muted-foreground'>Техническое задание:</span>
              <a
                href={`${API_BASE_URL}${project.technicalTask}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary font-medium hover:underline'
              >
                Посмотреть файл
              </a>
            </div>
          )}

          <div className='flex items-center gap-2 text-sm'>
            <Calendar className='text-muted-foreground h-4 w-4 flex-shrink-0' />
            <span className='text-muted-foreground'>Создан:</span>
            <span className='font-medium'>{sFormat(project?.createdAt || '')}</span>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
