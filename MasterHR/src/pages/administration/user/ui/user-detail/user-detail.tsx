import { useRef } from 'react';
import { ArrowLeft, Briefcase, Mail, Pencil, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { UseExtractSkills, useUser } from '@/api/endpoints/user';
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
import { useDialog } from '@/providers';

import { UserInfoMutateDialog } from './ui/user-info-mutate';

import type { GetUser } from '@/api/endpoints/user';

export function UserDetailPage() {
  const { userId } = useParams<{ userId: GetUser['id'] }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isPending: userIsPending } = useUser({ userId: userId || '' });

  const { mutate, isPending } = UseExtractSkills();

  const { showDialog } = useDialog();

  const handleUserInfoMutate = () => {
    showDialog({
      getContent: (onClose) => (
        <UserInfoMutateDialog
          closeDialog={onClose}
          name={user?.name || ''}
          surname={user?.name || ''}
          patronymic={user?.patronymic || ''}
          position={user?.position || ''}
          phoneNumber={user?.phoneNumber || ''}
          userId={userId!}
        />
      ),
    });
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('resumeFile', file);

      mutate(formData);

      console.debug(mutate);
    } catch (error) {
      console.error('Error extracting skills:', error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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

              <Button variant='outline' size='sm' className='ml-2 h-8 w-8 p-0' onClick={handleUserInfoMutate}>
                <Pencil className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
          <CardContent>
            <input type='file' ref={fileInputRef} onChange={handleFile} accept='.pdf,.doc,.docx' className='hidden' />
            <Button onClick={handleButtonClick} disabled={isPending}>
              {isPending ? 'Загрузка...' : 'Загрузить резюме'}
            </Button>
          </CardContent>
        </Card>
      </SuspenseWrapper>
    </>
  );
}
