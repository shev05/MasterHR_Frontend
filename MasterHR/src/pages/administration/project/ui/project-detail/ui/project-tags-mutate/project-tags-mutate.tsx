import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';

import { useProjectTagsMutate, useTagsProject, type PatchTagsProject } from '@/api/endpoints/project';
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
  Button,
} from '@/shared/components/ui';
import { CenteredSpinner } from '@/shared/components/centered-spinner';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { FormInput, FormVirtualCombobox } from '@/shared/components/controls';
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
import type { GetProject } from '@/api/endpoints/project';
import type { ProjectTagsFormValue } from './project-tags-mutate.lib';

type ProjectTagsMutateDialogProps = BaseDialogProps & {
  projectId: GetProject['id'];
};

export const ProjectTagsMutateDialog: FC<ProjectTagsMutateDialogProps> = ({ projectId, closeDialog }) => {
  const { data: projectTags, isPending: tagIsPending } = useTagsProject({ projectId });
  const { options: tagsOption, isPending: tagsOptionIsPending } = useTagsList({ queries: ALL_ELEMENTS_QUERY });

  const { mutate, isPending } = useProjectTagsMutate();

  const form = useForm<ProjectTagsFormValue>({
    defaultValues: PROJECT_TAGS_DEFAULT_VALUES,
    values: createProjectTagsFormValues(projectTags?.tags || []),
    resolver: yupCustomResolver({ validationSchema: PROJECT_TAGS_BASE_SCHEMA }),
  });

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const { handleSubmit, formState, reset, setError, control, watch } = form;
  const { isDirty } = formState;

  const watchedTags = watch(PROJECT_TAGS_FIELDS.TAGS);

  const { fields, append, remove } = useFieldArray({
    control,
    name: PROJECT_TAGS_FIELDS.TAGS,
  });

  const handleAddTag = () => {
    append({ tag: { value: '', label: '' }, year: 0, weight: 0 });
  };

  const handleFormSubmit = handleSubmit((formValues) => {
    const data: PatchTagsProject = {
      tags:
        formValues.tags
          ?.filter((item) => item.tag?.value)
          .map((item) => ({
            id: item.tag!.value,
            year: item.year ?? 0,
            weight: item.weight ?? 0,
          })) || [],
    };

    mutate(
      { projectId, data },
      {
        onSuccess: () => {
          toast.success('Теги обновлены');
          closeDialog();
          reset();
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
    <Dialog onOpenChange={handleDialogClose} open>
      <DialogContent className='max-w-6xl'>
        <SuspenseWrapper condition={tagIsPending || tagsOptionIsPending} fallback={<CenteredSpinner />}>
          <FormProvider {...form}>
            <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
              <DialogHeader>
                <DialogTitle>Изменить теги</DialogTitle>
                <SuspenseWrapper>
                  <DialogDescription>{PLACEHOLDERS.dialog}</DialogDescription>
                </SuspenseWrapper>
              </DialogHeader>
              <DialogBody className='pb-4'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium'>Теги</label>
                    <Button type='button' variant='outline' size='sm' onClick={handleAddTag}>
                      <Plus className='mr-1 h-3 w-3' />
                      Добавить тег
                    </Button>
                  </div>

                  {fields.length > 0 && (
                    <div className='space-y-3'>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className='grid grid-cols-[1fr_auto_1fr_auto] items-end gap-3 rounded-lg border p-3'
                        >
                          <FormVirtualCombobox
                            name={`${PROJECT_TAGS_FIELDS.TAGS}.${index}.tag`}
                            label='Тег'
                            options={tagsOption}
                            placeholder='Выберите тег...'
                          />
                          <FormInput
                            name={`${PROJECT_TAGS_FIELDS.TAGS}.${index}.year`}
                            label='Лет опыта'
                            type='number'
                            className='w-28'
                          />
                          <div className='flex items-center gap-2'>
                            <FormInput
                              name={`${PROJECT_TAGS_FIELDS.TAGS}.${index}.weight`}
                              label='Вес'
                              type='range'
                              min={0}
                              max={1}
                              step={0.01}
                              className='flex px-0'
                            />
                            <span className='min-w-[2rem] text-sm font-medium tabular-nums'>
                              {Math.round((watchedTags?.[index]?.weight ?? 0) * 100)}%
                            </span>
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-sm'
                            className='text-destructive mb-0.5 shrink-0 self-end'
                            onClick={() => remove(index)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
