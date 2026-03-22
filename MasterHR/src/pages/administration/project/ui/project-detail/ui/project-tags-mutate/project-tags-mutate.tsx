import { FormProvider, useForm } from 'react-hook-form';

import { useProjectTagsMutate, useTagsProject } from '@/api/endpoints/project';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';
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
import { CenteredSpinner } from '@/shared/components/centered-spinner';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { FormVirtualMultipleSelector } from '@/shared/components/controls/multiple-selector';
import { useTagsList } from '@/api/endpoints/tags';
import { ALL_ELEMENTS_QUERY } from '@/shared/constants';

import {
  createProjectTagsFormValues,
  PROJECT_TAGS_BASE_SCHEMA,
  PROJECT_TAGS_DEFAULT_VALUES,
  PROJECT_TAGS_FIELDS,
} from './project-tags-mutate.lib';

import type { BaseDialogProps } from '@/shared/interface';
import type { FC } from 'react';
import type { GetProject, PatchTagsProject } from '@/api/endpoints/project';
import type { ProjectTagsFormValue } from './project-tags-mutate.lib';

type ProjectTagsMutateDialogProps = BaseDialogProps & {
  projectId: GetProject['id'];
};

export const ProjectTagsMutateDialog: FC<ProjectTagsMutateDialogProps> = ({ projectId, closeDialog }) => {
  const { data: tags, isPending: tagIsPending } = useTagsProject({ projectId });
  const { options: tagsOption, isPending: tagsOptionIsPending } = useTagsList({ queries: ALL_ELEMENTS_QUERY });

  const { mutate, isPending } = useProjectTagsMutate();

  const form = useForm<ProjectTagsFormValue>({
    defaultValues: PROJECT_TAGS_DEFAULT_VALUES,
    values: createProjectTagsFormValues(tags || []),
    resolver: yupCustomResolver({ validationSchema: PROJECT_TAGS_BASE_SCHEMA }),
  });

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const { handleSubmit, formState, reset, setError } = form;
  const { isDirty } = formState;

  const handleFormSubmit = handleSubmit((formValues) => {
    const data: PatchTagsProject = {
      tags: formValues.tags?.map((item) => item.id) || [],
    };
    const mutationConfig = {
      onSuccess: () => {
        toast.success('Успех');
        closeDialog();
        reset();
      },
      onError: (error: Error) => parseApiErrors({ error, setError }),
    };

    mutate({ projectId, data }, mutationConfig);
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
        <SuspenseWrapper condition={tagIsPending || tagsOptionIsPending} fallback={<CenteredSpinner />}>
          <FormProvider {...form}>
            <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
              <DialogHeader>
                <DialogTitle>{`Изменить теги`}</DialogTitle>
                <SuspenseWrapper>
                  <DialogDescription>{PLACEHOLDERS.dialog}</DialogDescription>
                </SuspenseWrapper>
              </DialogHeader>
              <DialogBody className={'pb-4'}>
                <FormVirtualMultipleSelector
                  name={PROJECT_TAGS_FIELDS.TAGS}
                  options={tagsOption}
                  label='Теги'
                  required
                />
              </DialogBody>
              <DialogFooter className='relative'>
                <DialogButtonGroup disabled={isPending} handleClose={handleDialogClose} />
              </DialogFooter>
            </form>
          </FormProvider>
        </SuspenseWrapper>
      </DialogContent>
    </Dialog>
  );
};
