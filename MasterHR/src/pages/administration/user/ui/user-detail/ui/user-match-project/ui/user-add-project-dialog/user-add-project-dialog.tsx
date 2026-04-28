import { FormProvider, useForm } from 'react-hook-form';

import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';
import { useUserAddProject } from '@/api/endpoints/project';
import { FormSelect } from '@/shared/components/controls';
import { ROLE_OPTIONS } from '@/pages/administration/project/ui/project-detail/ui/project-user-mutate/project-user-mutate.lib';
import {
  Dialog,
  DialogBody,
  DialogButtonGroup,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';

import { CREATE_USER_ADD_PROJECT_FIELDS_SCHEMA, USER_ADD_PROJECT_FIELDS } from './user-add-project-dialog.lib';

import type { BaseDialogProps } from '@/shared/interface';
import type { FC } from 'react';
import type { CreateUserAddProjectFormValue } from './user-add-project-dialog.lib';

type UserAddProjectDialogProps = BaseDialogProps & {
  projectId: string;
  userId: string;
  closeParentDialog: () => void;
};

export const UserAddProjectDialog: FC<UserAddProjectDialogProps> = ({
  closeDialog,
  userId,
  projectId,
  closeParentDialog,
}) => {
  const { mutate, isPending } = useUserAddProject();

  const form = useForm<CreateUserAddProjectFormValue>({
    resolver: yupCustomResolver({ validationSchema: CREATE_USER_ADD_PROJECT_FIELDS_SCHEMA }),
  });

  const { handleSubmit, setError, formState } = form;
  const { isDirty } = formState;

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const handleFormSubmit = handleSubmit((formValues) => {
    mutate(
      {
        user: {
          id: userId,
          role: formValues.role,
        },
        projectId: projectId,
      },

      {
        onSuccess: () => {
          toast.success('Пользователь добавлен');
          closeDialog();

          closeParentDialog();
        },
        onError: (error: Error) => parseApiErrors({ error, setError }),
      }
    );
  });

  const handleDialogClose = () => {
    if (isDirty) {
      openCloseDialogAlert({
        onSave: handleFormSubmit,
        onDismiss: closeDialog,
      });
      return;
    }
    closeDialog();
  };

  return (
    <Dialog onOpenChange={closeDialog} open>
      <DialogContent className='max-w-xl'>
        <FormProvider {...form}>
          <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
            <DialogHeader>
              <DialogTitle>Выберите роль в проекте</DialogTitle>
            </DialogHeader>
            <DialogBody className='space-y-4 pb-4'>
              <FormSelect label='Роль' name={USER_ADD_PROJECT_FIELDS.ROLE} options={ROLE_OPTIONS} defaultValue={0} />
            </DialogBody>
            <DialogFooter className='relative'>
              <DialogButtonGroup disabled={isPending} handleClose={handleDialogClose} />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
