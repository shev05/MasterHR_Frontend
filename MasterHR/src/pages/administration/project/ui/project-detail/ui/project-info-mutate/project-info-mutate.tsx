import { FormProvider, useForm } from 'react-hook-form';

import { useProjectInfoMutate } from '@/api/endpoints/project';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';
import {
  Dialog,
  DialogBody,
  DialogButtonGroup,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  SuspenseWrapper,
} from '@/shared/components/ui';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { FormVoiceInput } from '@/shared/components/controls/voice-input';
import { FormVoiceTextarea } from '@/shared/components/controls';

import {
  createProjectInfoFormValues,
  PROJECT_INFO_BASE_SCHEMA,
  PROJECT_INFO_DEFAULT_VALUES,
  PROJECT_INFO_FIELDS,
  type ProjectInfoFormValue,
} from './project-info-mutate.lib';

import type { GetProject } from '@/api/endpoints/project';
import type { BaseDialogProps } from '@/shared/interface';
import type { FC } from 'react';

type ProjectInfoMutateDialogProps = BaseDialogProps & {
  title: GetProject['title'];
  description: GetProject['description'];
  projectId: GetProject['id'];
};

export const ProjectInfoMutateDialog: FC<ProjectInfoMutateDialogProps> = ({
  title,
  description,
  projectId,
  closeDialog,
}) => {
  const { mutate, isPending } = useProjectInfoMutate();

  const form = useForm<ProjectInfoFormValue>({
    defaultValues: PROJECT_INFO_DEFAULT_VALUES,
    values: createProjectInfoFormValues(title, description),
    resolver: yupCustomResolver({ validationSchema: PROJECT_INFO_BASE_SCHEMA }),
  });

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const { handleSubmit, formState, reset, setError } = form;
  const { isDirty } = formState;

  const handleFormSubmit = handleSubmit((formValues) => {
    const mutationConfig = {
      onSuccess: () => {
        toast.success('Успех');
        closeDialog();
        reset();
      },
      onError: (error: Error) => parseApiErrors({ error, setError }),
    };

    mutate({ projectId, data: formValues }, mutationConfig);
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
    <Dialog onOpenChange={handleDialogClose} open>
      <DialogContent className='max-w-6xl'>
        <FormProvider {...form}>
          <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
            <DialogHeader>
              <DialogTitle>{'Изменить информацию'}</DialogTitle>
              <SuspenseWrapper>
                <DialogDescription>{PLACEHOLDERS.dialog}</DialogDescription>
              </SuspenseWrapper>
            </DialogHeader>
            <DialogBody className={'pb-4'}>
              <FormVoiceInput name={PROJECT_INFO_FIELDS.TITLE} label='Название' required />
              <FormVoiceTextarea name={PROJECT_INFO_FIELDS.DESCRIPTION} label='Описание' required />
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
