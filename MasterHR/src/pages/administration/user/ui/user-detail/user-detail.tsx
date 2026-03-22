import { ArrowLeft, Briefcase, Mail, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { useUser } from '@/api/endpoints/user';
import { AppPageHeader } from '@/shared/components/app-page-header';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  SuspenseWrapper,
} from '@/shared/components/ui';
import { ROUTES_META } from '@/shared/constants/routes/router-meta';
import { roleUser } from '@/shared/constants/role-user';

import type { GetUser } from '@/api/endpoints/user';

export function UserDetailPage() {
  const { userId } = useParams<{ userId: GetUser['id'] }>();
  const navigate = useNavigate();

  const { data: user, isPending: userIsPending } = useUser({ userId: userId || '' });
  return (
    <>
      <AppPageHeader className='mb-0'>
        <Button variant='ghost' size='sm' onClick={() => navigate(ROUTES_META.ROOT_ADMINISTRATION_USERS.absPath)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Назад к пользователям
        </Button>
      </AppPageHeader>
      <SuspenseWrapper condition={!userIsPending}>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-start'>
              <Avatar className='h-24 w-24'>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
                  {user?.surname?.charAt(0).toUpperCase()}
                  {user?.patronymic?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 space-y-2 text-center sm:text-left'>
                <div className='flex flex-wrap items-center justify-center gap-2 sm:justify-start'>
                  <h1 className='text-2xl font-bold'>
                    {user?.name} {user?.surname} {user?.patronymic}
                  </h1>
                  {roleUser[user?.role || 0]}
                </div>

                {user?.position && (
                  <div className='text-muted-foreground flex items-center justify-center gap-2 sm:justify-start'>
                    <Briefcase className='h-4 w-4' />
                    <span>{user.position}</span>
                  </div>
                )}

                <div className='flex flex-wrap items-center justify-center gap-4 pt-2 sm:justify-start'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Mail className='text-muted-foreground h-4 w-4' />
                    <a href={`mailto:${user?.email}`} className='hover:underline'>
                      {user?.email}
                    </a>
                  </div>
                  {user?.phoneNumber && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Phone className='text-muted-foreground h-4 w-4' />
                      <a href={`tel:${user?.phoneNumber}`} className='hover:underline'>
                        {user?.phoneNumber}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SuspenseWrapper>
    </>
  );
}
