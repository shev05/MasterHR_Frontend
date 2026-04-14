import { useRef } from 'react';
import { ArrowLeft, Briefcase, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { UseExtractSkills, UseMe, useUser, useUserAvatarUpdate } from '@/api/endpoints/user';
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
import { API_BASE_URL, parseApiErrors } from '@/api/http-client';
import { useSkillsDelete, useSkillsList, type GetSkills } from '@/api/endpoints/skills';
import { toast } from '@/shared/components/app-toaster';
import { CenteredSpinner } from '@/shared/components/centered-spinner';
import { cn } from '@/shared/lib';

import { UserInfoMutateDialog } from './ui/user-info-mutate';
import { UserSkillsCreateDialog } from './ui/user-skills-add';
import { AvatarUploadDialog } from './ui/user-avatar-add';

import type { GetUser } from '@/api/endpoints/user';

const SKILL_LEVELS = {
  Base: { label: 'Base', className: 'bg-green-100 text-green-800 border-green-300' },
  Middle: { label: 'Middle', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  Advanced: { label: 'Advanced', className: 'bg-red-100 text-red-800 border-red-300' },
} as const;

export function UserDetailPage() {
  const { userId } = useParams<{ userId: GetUser['id'] }>();
  const navigate = useNavigate();
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

  const handleUserSkillsAddCreate = () => {
    showDialog({
      getContent: (onClose) => <UserSkillsCreateDialog closeDialog={onClose} />,
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

      mutate(formData);

      console.debug(mutate);
    } catch (error) {
      console.error('Error extracting skills:', error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleButtonDeleteSkill = (skillId: GetSkills['id']) => {
    deleteSkill(skillId, {
      onSuccess: () => {
        toast.success('Навык удален');
      },
      onError: (error: Error) => parseApiErrors({ error }),
    });
  };

  const getLevelConfig = (level: string) => {
    return (
      SKILL_LEVELS[level as keyof typeof SKILL_LEVELS] || {
        label: level,
        className: 'bg-gray-100 text-gray-800 border-gray-300',
      }
    );
  };

  return (
    <>
      <AppPageHeader className='mb-0'>
        <Button variant='ghost' size='sm' onClick={() => navigate(ROUTES_META.ROOT_ADMINISTRATION_USERS.absPath)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Назад к сотрудникам
        </Button>
      </AppPageHeader>
      <SuspenseWrapper condition={userIsPending || deleteSkillIsPending} fallback={<CenteredSpinner />}>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-start'>
              <Avatar className={cn('h-24 w-24', isMe && 'cursor-pointer')} onClick={handleUserAvatarUpdateDialog}>
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
          <CardContent className='border-t pt-6'>
            <div className='flex justify-between'>
              <h2 className='mb-4 text-lg font-semibold'>Навыки</h2>
              {isMe && <Button onClick={handleUserSkillsAddCreate}>Добавить навык</Button>}
            </div>
            <SuspenseWrapper condition={!skillsIsPending}>
              <div className='flex flex-wrap gap-3'>
                {skillsData?.skills && skillsData.skills.length > 0 ? (
                  skillsData.skills.map((skill) => {
                    const levelConfig = getLevelConfig(skill.level);
                    return (
                      <div
                        key={skill.id}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 ${levelConfig.className}`}
                      >
                        <span className='font-medium'>{skill.name}</span>
                        <span>
                          {levelConfig.label} {skill.years}{' '}
                          {skill.years === 1 ? 'год' : skill.years < 5 ? 'года' : 'лет'}
                        </span>
                        {isMe && (
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
