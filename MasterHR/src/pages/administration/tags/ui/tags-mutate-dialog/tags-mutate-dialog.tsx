import { FormProvider, useForm } from 'react-hook-form';

import { useTag, useTagCreate } from '@/api/endpoints/tags';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';
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
import { getDialogTitle } from '@/shared/lib/get-dialog-title';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { FormVoiceInput } from '@/shared/components/controls/voice-input';

import { createTagsFormValues, TAGS_BASE_SCHEMA, TAGS_DEFAULT_VALUES, TAGS_FIELDS } from './tags-mutate-dialog.lib';

import type { GetTags } from '@/api/endpoints/tags';
import type { BaseDialogProps } from '@/shared/interface';
import type { FC } from 'react';
import type { TagsFormValue } from './tags-mutate-dialog.lib';

type TagsMutateDialogProps = BaseDialogProps & {
  tagId?: GetTags['id'];
};

export const TagsMutateDialog: FC<TagsMutateDialogProps> = ({ tagId, closeDialog, isViewMode }) => {
  const isEdit = !!tagId;

  const { data: tag, isPending: tagIsPending } = useTag({ tagId: tagId || '' }, { enabled: !!tagId });

  const { mutate: create, isPending: createIsPending } = useTagCreate();

  const form = useForm<TagsFormValue>({
    defaultValues: TAGS_DEFAULT_VALUES,
    values: createTagsFormValues(tag?.list),
    resolver: yupCustomResolver({ validationSchema: TAGS_BASE_SCHEMA }),
  });

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const { handleSubmit, formState, reset, setError } = form;
  const { isDirty } = formState;

  const handleFormSubmit = handleSubmit((formValues) => {
    const mutationConfig = {
      onSuccess: () => {
        toast.success('Тэг создан');
        closeDialog();
        reset();
      },
      onError: (error: Error) => parseApiErrors({ error, setError }),
    };

    create(formValues, mutationConfig);
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
        <SuspenseWrapper condition={isEdit && tagIsPending} fallback={<CenteredSpinner />}>
          <FormProvider {...form}>
            <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
              <DialogHeader>
                <DialogTitle>{`${getDialogTitle({ isEditMode: isEdit, isViewMode })} тега`}</DialogTitle>
                <SuspenseWrapper condition={!isViewMode}>
                  <DialogDescription>{PLACEHOLDERS.dialog}</DialogDescription>
                </SuspenseWrapper>
              </DialogHeader>
              <DialogBody className={'pb-4'}>
                <FormVoiceInput name={TAGS_FIELDS.TITLE} label='Название' required />
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
