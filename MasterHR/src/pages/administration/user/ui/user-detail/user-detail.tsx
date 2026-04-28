import { useRef } from 'react';
import { Briefcase, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { UseMe, useUser, useUserAvatarUpdate } from '@/api/endpoints/user';
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
import { roleUser } from '@/shared/constants/role-user';
import { useDialog } from '@/providers';
import { API_BASE_URL, parseApiErrors } from '@/api/http-client';
import { UseExtractSkills, useSkillsDelete, useSkillsList, type GetSkills } from '@/api/endpoints/skills';
import { toast } from '@/shared/components/app-toaster';
import { CenteredSpinner } from '@/shared/components/centered-spinner';
import { cn } from '@/shared/lib';
import { BackButton } from '@/shared/components/back-button';

import { UserInfoMutateDialog } from './ui/user-info-mutate';
import { UserSkillsCreateDialog } from './ui/user-skills-add';
import { AvatarUploadDialog } from './ui/user-avatar-add';
import { UserMatchProjectDialog } from './ui/user-match-project';

import type { GetUser } from '@/api/endpoints/user';

const EXPERIENCE_COLORS = {
  junior: { className: 'bg-green-100 text-green-800 border-green-300', maxYears: 1 },
  middle: { className: 'bg-orange-100 text-orange-800 border-orange-300', maxYears: 4 },
  senior: { className: 'bg-red-100 text-red-800 border-red-300', maxYears: Infinity },
} as const;

export function UserDetailPage() {
  const { userId } = useParams<{ userId: GetUser['id'] }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: currentUser } = UseMe();
  const { data: user, isPending: userIsPending } = useUser({ userId: userId || '' });
  const { mutate: avatarUpdate } = useUserAvatarUpdate();
  const { mutate: deleteSkill, isPending: deleteSkillIsPending } = useSkillsDelete();

  const { data: skillsData, isPending: skillsIsPending } = useSkillsList(
    { userId: userId || '' },
    { enabled: !!userId }
  );
  const isMe = currentUser?.id === user?.id;

  const { mutate: skillFileAdd, isPending } = UseExtractSkills();

  const { showDialog } = useDialog();

  const handleUserInfoMutate = () => {
    showDialog({
      getContent: (onClose) => (
        <UserInfoMutateDialog
          closeDialog={onClose}
          name={user?.name || ''}
          surname={user?.surname || ''}
          patronymic={user?.patronymic || ''}
          position={user?.position || ''}
          phoneNumber={user?.phoneNumber || ''}
          userId={userId!}
        />
      ),
    });
  };

  const handleUserSkillsAddCreate = () => {
    if (!userId) return;

    showDialog({
      getContent: (onClose) => <UserSkillsCreateDialog closeDialog={onClose} userId={userId} />,
    });
  };

  const handleUserMatchProject = () => {
    if (!userId) return;

    showDialog({
      getContent: (onClose) => <UserMatchProjectDialog closeDialog={onClose} userId={userId} />,
    });
  };

  const handleUserAvatarUpdateDialog = () => {
    if (!isMe) return;
    showDialog({
      getContent: (onClose) => (
        <AvatarUploadDialog
          closeDialog={onClose}
          currentAvatar={user?.avatar}
          onSave={async (file) => {
            avatarUpdate(file, {
              onSuccess: () => {
                toast.success('Аватар изменен');
              },
              onError: (error: Error) => parseApiErrors({ error }),
            });
          }}
          title='Обновить фото профиля'
          fallback={user?.name?.charAt(0)}
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

      skillFileAdd(formData, {
        onSuccess: () => {
          toast.success('Круто');
        },
        onError: (error: Error) => parseApiErrors({ error }),
      });
    } catch (error) {
      console.error('Error extracting skills:', error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleButtonDeleteSkill = (skillId: GetSkills['id']) => {
    if (!userId) return;

    deleteSkill(
      { skillId, userId },
      {
        onSuccess: () => {
          toast.success('Навык удален');
        },
        onError: (error: Error) => parseApiErrors({ error }),
      }
    );
  };

  const getLevelConfig = (years: number) => {
    if (years <= EXPERIENCE_COLORS.junior.maxYears) return EXPERIENCE_COLORS.junior;
    if (years <= EXPERIENCE_COLORS.middle.maxYears) return EXPERIENCE_COLORS.middle;
    return EXPERIENCE_COLORS.senior;
  };

  return (
    <>
      <AppPageHeader className='mb-0'>
        <BackButton />
      </AppPageHeader>
      <SuspenseWrapper condition={userIsPending || deleteSkillIsPending} fallback={<CenteredSpinner />}>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-start'>
              <Avatar
                className={cn('h-24 w-24', user?.canEdit && 'cursor-pointer')}
                onClick={handleUserAvatarUpdateDialog}
              >
                <AvatarImage src={`${API_BASE_URL}${user?.avatar}`} />
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

              {user?.canEdit && (
                <Button variant='outline' size='sm' className='ml-2 h-8 w-8 p-0' onClick={handleUserInfoMutate}>
                  <Pencil className='h-4 w-4' />
                </Button>
              )}
            </div>
          </CardContent>
          <CardContent className='flex flex-col gap-3 border-t pt-6'>
            <div className='flex justify-between'>
              <h2 className='mb-4 text-lg font-semibold'>Навыки</h2>
              {user?.canEdit && (
                <div className='flex gap-2'>
                  <>
                    <input
                      type='file'
                      ref={fileInputRef}
                      onChange={handleFile}
                      accept='.pdf,.doc,.docx'
                      className='hidden'
                    />
                    <Button onClick={handleButtonClick} disabled={isPending}>
                      {isPending ? 'Загрузка...' : 'Загрузить резюме'}
                    </Button>
                  </>
                  <Button onClick={handleUserSkillsAddCreate}>Добавить навык</Button>
                </div>
              )}
            </div>
            <SuspenseWrapper condition={!skillsIsPending}>
              <div className='max-h-70 flex flex-wrap gap-3 overflow-y-auto pr-2'>
                {skillsData?.skills && skillsData.skills.length > 0 ? (
                  skillsData.skills.map((skill) => {
                    return (
                      <div
                        key={skill.id}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 ${getLevelConfig(skill.years).className}`}
                      >
                        <span className='truncate font-medium' title={skill.name}>
                          {skill.name}
                        </span>{' '}
                        <span>
                          {skill.years != null
                            ? `${skill.years} ${skill.years === 1 ? 'год' : skill.years < 5 ? 'года' : 'лет'}`
                            : null}
                        </span>
                        {user?.canEdit && (
                          <Button
                            variant={'ghost'}
                            size='icon-sm'
                            className='cursor-pointer'
                            onClick={() => handleButtonDeleteSkill(skill.id)}
                          >
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className='text-muted-foreground text-sm'>Навыки не найдены</p>
                )}
              </div>
            </SuspenseWrapper>
          </CardContent>
          <CardContent className='border-t pt-6'>
            <div className='flex justify-between'>
              <h2 className='mb-4 text-lg font-semibold'>Проекты</h2>
              <Button onClick={handleUserMatchProject}>Найти нужный проект</Button>
            </div>
          </CardContent>
        </Card>
      </SuspenseWrapper>
    </>
  );
}
