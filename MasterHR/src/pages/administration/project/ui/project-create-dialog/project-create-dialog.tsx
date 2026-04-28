import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { useState, useRef } from 'react';
import { Trash2, Plus, Upload, FileText, X } from 'lucide-react';

import { useProjectCreate } from '@/api/endpoints/project';
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
import { useTagsList } from '@/api/endpoints/tags';
import { FormVoiceInput } from '@/shared/components/controls/voice-input';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';
import { CenteredSpinner } from '@/shared/components/centered-spinner';
import { ALL_ELEMENTS_QUERY } from '@/shared/constants';
import { FormCombobox, FormInput, FormVoiceTextarea } from '@/shared/components/controls';

import { CREATE_PROJECT_SCHEMA, PROJECT_FIELDS, PROJECT_DEFAULT_VALUES } from './project-create-dialog.lib';

import type { BaseDialogProps } from '@/shared/interface';
import type { FC } from 'react';
import type { CreateProjectFormValue } from './project-create-dialog.lib';

type ProjectCreateDialogProps = BaseDialogProps;

const ACCEPTED_FILES = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.bmp,.webp,.txt,.rtf';

export const ProjectCreateDialog: FC<ProjectCreateDialogProps> = ({ closeDialog }) => {
  const { mutate: createProject, isPending: createIsPending } = useProjectCreate();

  const { options: tags, isPending: tagsIsPending } = useTagsList({ queries: ALL_ELEMENTS_QUERY });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<CreateProjectFormValue>({
    resolver: yupCustomResolver({ validationSchema: CREATE_PROJECT_SCHEMA }),
    defaultValues: PROJECT_DEFAULT_VALUES,
  });

  const { handleSubmit, formState, reset, setError, control, watch, setValue } = form;
  const { isDirty } = formState;

  const watchedTags = watch(PROJECT_FIELDS.TAGS);

  const { fields, append, remove } = useFieldArray({
    control,
    name: PROJECT_FIELDS.TAGS,
  });

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const getAvailableTags = (currentIndex: number) => {
    const selectedIds = fields.filter((_, index) => index !== currentIndex).map((field) => String(field.id));

    return tags
      .filter((tag) => !selectedIds.includes(String(tag.value)))
      .map((tag) => ({ value: tag.value, label: tag.label }));
  };

  const handleAddTag = () => {
    append({ id: '', year: 0, weight: 0 });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue(PROJECT_FIELDS.TECHNICAL_TASK, file, { shouldDirty: true });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValue(PROJECT_FIELDS.TECHNICAL_TASK, null, { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = handleSubmit((formValues) => {
    const formData = new FormData();

    formData.append('Title', formValues.title);
    formData.append('Description', formValues.description);
    formData.append('Customer', formValues.customer);

    if (formValues.technicalTask instanceof File) {
      formData.append('TechnicalTask', formValues.technicalTask);
    }

    formValues.tags?.forEach((item, index) => {
      if (item.id) {
        formData.append(`Tags[${index}].id`, item.id);
        formData.append(`Tags[${index}].year`, String(item.year ?? 0));
        formData.append(`Tags[${index}].weight`, String(item.weight ?? 0));
      }
    });

    createProject(formData, {
      onSuccess: () => {
        toast.success('Проект успешно создан');
        closeDialog();
        reset();
        setSelectedFile(null);
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  return (
    <Dialog onOpenChange={handleDialogClose} open>
      <DialogContent className='max-w-5xl'>
        <SuspenseWrapper condition={tagsIsPending} fallback={<CenteredSpinner />}>
          <FormProvider {...form}>
            <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
              <DialogHeader>
                <DialogTitle>Создание проекта</DialogTitle>
                <DialogDescription>Заполните информацию о новом проекте</DialogDescription>
              </DialogHeader>

              <DialogBody className='space-y-4 pb-4'>
                <FormVoiceInput
                  name={PROJECT_FIELDS.TITLE}
                  label='Название проекта'
                  placeholder='Введите название проекта'
                  required
                />

                <FormVoiceInput
                  name={PROJECT_FIELDS.CUSTOMER}
                  label='Заказчик'
                  placeholder='Введите название заказчика'
                  required
                />

                <FormVoiceTextarea
                  name={PROJECT_FIELDS.DESCRIPTION}
                  label='Описание'
                  placeholder='Введите описание проекта'
                />

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Техническое задание</label>
                  <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={ACCEPTED_FILES}
                    className='hidden'
                  />
                  {selectedFile ? (
                    <div className='flex items-center gap-3 rounded-lg border p-3'>
                      <FileText className='text-muted-foreground h-5 w-5 shrink-0' />
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium'>{selectedFile.name}</p>
                        <p className='text-muted-foreground text-xs'>{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon-sm'
                        className='text-destructive shrink-0'
                        onClick={handleRemoveFile}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className='mr-2 h-4 w-4' />
                      Прикрепить файл
                    </Button>
                  )}
                </div>

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
                          <FormCombobox
                            name={`${PROJECT_FIELDS.TAGS}.${index}.id`}
                            label='Тег'
                            options={getAvailableTags(index)}
                            placeholder='Выберите тег...'
                          />
                          <FormInput
                            name={`${PROJECT_FIELDS.TAGS}.${index}.year`}
                            label='Лет опыта'
                            type='number'
                            className='w-28'
                          />
                          <div className='flex items-center gap-2'>
                            <FormInput
                              name={`${PROJECT_FIELDS.TAGS}.${index}.weight`}
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
                <DialogButtonGroup disabled={createIsPending} handleClose={handleDialogClose} />
              </DialogFooter>
            </form>
          </FormProvider>
        </SuspenseWrapper>
      </DialogContent>
    </Dialog>
  );
};
