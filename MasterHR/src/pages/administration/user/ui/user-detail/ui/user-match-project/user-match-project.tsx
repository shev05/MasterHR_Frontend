import { Check, Eye } from 'lucide-react';
import { useState, type FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useUserMatch, type MatchProjectRepsonse } from '@/api/endpoints/user';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';
import { useProjectList } from '@/api/endpoints/project';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SuspenseWrapper,
} from '@/shared/components/ui';
import { FormInput } from '@/shared/components/controls';
import { useLocalDialog } from '@/providers';
import { ALL_ELEMENTS_QUERY } from '@/shared/constants';
import { CenteredSpinner } from '@/shared/components/centered-spinner';

import { ProjectInfoViewDialog } from './ui/project-detail-dialog';
import {
  CREATE_USER_MATCH_FIELDS_SCHEMA,
  USER_MATCH_FIELDS,
  USER_MATCH_FIELDS_DEFAULT_VALUES,
} from './user-match-project.lib';
import { UserAddProjectDialog } from './ui/user-add-project-dialog';

import type { BaseDialogProps } from '@/shared/interface';
import type { CreateUserMatchFormValue } from './user-match-project.lib';

type UserUserMatchProjectDialogProps = BaseDialogProps & {
  userId: string;
};

export const UserMatchProjectDialog: FC<UserUserMatchProjectDialogProps> = ({ closeDialog, userId }) => {
  const [projects, setProject] = useState<MatchProjectRepsonse>();

  const { data: projectData } = useProjectList({ queries: { ExceptUser: userId, ...ALL_ELEMENTS_QUERY } });
  const { mutate: projectMatch, isPending: projectMatchIsPending } = useUserMatch();

  const form = useForm<CreateUserMatchFormValue>({
    resolver: yupCustomResolver({ validationSchema: CREATE_USER_MATCH_FIELDS_SCHEMA }),
    defaultValues: USER_MATCH_FIELDS_DEFAULT_VALUES,
  });

  const { handleSubmit, setError, watch } = form;

  const { showDialog, dialog: localDialog } = useLocalDialog();

  const watchedTags = watch(USER_MATCH_FIELDS.MIN_SCORE_PERCENT);

  const handleFormSubmit = handleSubmit((formValues) => {
    if (!projectData) return;

    const ids = projectData.list.map((sel) => sel.id);

    projectMatch(
      {
        ...formValues,
        userId: userId,
        projectIds: ids,
      },

      {
        onSuccess: (response: MatchProjectRepsonse) => {
          setProject(response);
          toast.success('Найдено');
        },
        onError: (error: Error) => parseApiErrors({ error, setError }),
      }
    );
  });

  const handleViewProject = (projectId: string) => {
    showDialog({
      getContent: (onClose) => <ProjectInfoViewDialog projectId={projectId} closeDialog={onClose} />,
    });
  };

  const handleUserAddProject = (projectId: string) => {
    showDialog({
      getContent: (onClose) => (
        <UserAddProjectDialog
          projectId={projectId}
          userId={userId}
          closeDialog={onClose}
          closeParentDialog={closeDialog}
        />
      ),
    });
  };

  return (
    <>
      {localDialog}
      <Dialog onOpenChange={closeDialog} open>
        <DialogContent className='max-w-2xl'>
          <FormProvider {...form}>
            <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
              <DialogHeader>
                <DialogTitle>Поискa проекта</DialogTitle>
                <DialogDescription>Выберите процент на сколько будут подходить навыки</DialogDescription>
              </DialogHeader>
              <DialogBody className='space-y-4 pb-4'>
                <div className='flex items-center gap-2'>
                  <FormInput
                    name={USER_MATCH_FIELDS.MIN_SCORE_PERCENT}
                    label='Процент'
                    type='range'
                    min={0}
                    max={100}
                    step={1}
                    className='flex px-0'
                  />
                  <span className='min-w-[2rem] text-sm font-medium tabular-nums'>{watchedTags ?? 50}%</span>
                </div>
                <div className='flex justify-end'>
                  <Button type='submit' disabled={projectMatchIsPending}>
                    Поиск
                  </Button>
                </div>
              </DialogBody>
            </form>
            <DialogBody>
              <SuspenseWrapper condition={projectMatchIsPending} fallback={<CenteredSpinner />}>
                {projects && projects.length > 0 && (
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium'>Найденные проекты</h4>
                    {projects.map((item) => (
                      <div key={item.projectId} className='flex items-center justify-between border-b py-2'>
                        <span className='text-sm'>{item.projectName}</span>
                        <div>
                          <Button variant='ghost' size='icon-sm' onClick={() => handleUserAddProject(item.projectId)}>
                            <Check className='text-green-500' />
                          </Button>
                          <Button variant='ghost' size='icon-sm' onClick={() => handleViewProject(item.projectId)}>
                            <Eye />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SuspenseWrapper>
            </DialogBody>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};
