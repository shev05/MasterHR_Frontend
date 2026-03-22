import { FormProvider, useForm } from 'react-hook-form';

import { useProjectCreate, type PostProject } from '@/api/endpoints/project';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';
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
import { useTagsList } from '@/api/endpoints/tags';
import { FormInput } from '@/shared/components/controls';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';
import { CenteredSpinner } from '@/shared/components/centered-spinner';
import { FormVirtualMultipleSelector } from '@/shared/components/controls/multiple-selector';
import { ALL_ELEMENTS_QUERY } from '@/shared/constants';

import { CREATE_PROJECT_SCHEMA, PROJECT_FIELDS } from './project-create-dialog.lib';

import type { BaseDialogProps } from '@/shared/interface';
import type { FC } from 'react';
import type { CreateProjectFormValue } from './project-create-dialog.lib';

type ProjectCreateDialogProps = BaseDialogProps;

export const ProjectCreateDialog: FC<ProjectCreateDialogProps> = ({ closeDialog }) => {
  const { mutate: createProject, isPending: createIsPending } = useProjectCreate();

  const { options: tags, isPending: tagsIsPending } = useTagsList({ queries: ALL_ELEMENTS_QUERY });

  const form = useForm<CreateProjectFormValue>({
    resolver: yupCustomResolver({ validationSchema: CREATE_PROJECT_SCHEMA }),
  });

  const { handleSubmit, formState, reset, setError } = form;
  const { isDirty } = formState;

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const handleFormSubmit = handleSubmit((formValues) => {
    const data: PostProject = {
      ...formValues,
      tags: formValues?.tags?.map((item) => String(item.value)) || [],
    };

    createProject(data, {
      onSuccess: () => {
        toast.success('Проект успешно создан');
        closeDialog();
        reset();
      },
      onError: (error: Error) => parseApiErrors({ error, setError }),
    });
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
      <DialogContent className='max-w-2xl'>
        <SuspenseWrapper condition={tagsIsPending} fallback={<CenteredSpinner />}>
          <FormProvider {...form}>
            <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
              <DialogHeader>
                <DialogTitle>Создание проекта</DialogTitle>
                <DialogDescription>Заполните информацию о новом проекте</DialogDescription>
              </DialogHeader>

              <DialogBody className='space-y-4 pb-4'>
                <FormInput
                  name={PROJECT_FIELDS.TITLE}
                  label='Название проекта'
                  placeholder='Введите название проекта'
                  required
                />

                <FormInput name={PROJECT_FIELDS.DESCRIPTION} label='Описание' placeholder='Введите описание проекта' />

                <FormVirtualMultipleSelector
                  name={PROJECT_FIELDS.TAGS}
                  label='Теги'
                  options={tags}
                  placeholder='Выберите теги'
                />
              </DialogBody>

              <DialogFooter className='relative'>
                <DialogButtonGroup disabled={createIsPending} handleClose={handleDialogClose} />
              </DialogFooter>
            </form>
          </FormProvider>
        </SuspenseWrapper>
      </DialogContent>
    </Dialog>
  );
};
