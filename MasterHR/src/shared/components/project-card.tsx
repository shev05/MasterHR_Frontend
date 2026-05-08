import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Badge, Button, Card, CardContent } from '@/shared/components/ui';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';

import type { GetProject } from '@/api/endpoints/project';

interface ProjectCardProps {
  project: GetProject;
  currentUserId?: string;
}

export function ProjectCard({ project, currentUserId }: ProjectCardProps) {
  const navigate = useNavigate();
  const isCreator = project.createdBy.id === currentUserId;

  return (
    <Card className='transition-shadow hover:shadow-md'>
      <CardContent className='p-4'>
        <div className='mb-2 flex items-start justify-between'>
          <h4 className='font-semibold'>{project.title}</h4>
          <Button
            variant='ghost'
            size='icon-sm'
            onClick={() => {
              navigate(ROUTES_META.ROOT_PROJECT_DETAIL.generatePath({ projectId: project.id }));
            }}
          >
            <Eye />
          </Button>
        </div>

        <p className='text-muted-foreground mb-3 line-clamp-2 text-sm'>{project.description}</p>

        {!isCreator && (
          <p className='text-muted-foreground mb-2 text-xs'>
            Создатель: {project.createdBy.name} {project.createdBy.surname}
          </p>
        )}

        {project.customer && <p className='text-muted-foreground mb-2 text-xs'>Заказчик: {project.customer}</p>}

        {project.tags && project.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {project.tags.map((tag) => (
              <Badge key={tag.id} variant='secondary' className='text-xs'>
                {tag.title}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
