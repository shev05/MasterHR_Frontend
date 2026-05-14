import { FormProvider, useForm } from 'react-hook-form';

import { useWorklogCreate } from '@/api/endpoints/worklogs';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';
import { useCurrUser } from '@/store';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';
import {
  Dialog,
  DialogBody,
  DialogButtonGroup,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';
import { FormInput } from '@/shared/components/controls/input';
import { FormDatePicker } from '@/shared/components/controls/date-picker';
import { FormVirtualCombobox, FormVoiceTextarea } from '@/shared/components/controls';
import { useProjectList } from '@/api/endpoints/project';
import { DATE_FORMATS, sFormat } from '@/shared/lib';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';

import {
  createWorklogFormValues,
  WORKLOG_BASE_SCHEMA,
  WORKLOG_DEFAULT_VALUES,
  WORKLOG_FIELDS,
  type WorklogFormValue,
  type WorkLogFormValue,
} from './create-worklog.lib';

import type { BaseDialogProps } from '@/shared/interface';
import type { PostWorklog } from '@/api/endpoints/worklogs';

type Props = BaseDialogProps & {
  initialValues?: WorklogFormValue;
};

export function WorklogCreateDialog({ closeDialog, isViewMode, initialValues }: Props) {
  const { mutate: createWorklog, isPending } = useWorklogCreate();
  const { options, isPending: optionIsPending } = useProjectList();

  const user = useCurrUser();

  const form = useForm<WorkLogFormValue>({
    defaultValues: WORKLOG_DEFAULT_VALUES,
    values: createWorklogFormValues(initialValues),
    resolver: yupCustomResolver({ validationSchema: WORKLOG_BASE_SCHEMA }),
  });

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const { handleSubmit, formState, reset, setError } = form;
  const { isDirty } = formState;

  const onSubmit = handleSubmit((values) => {
    if (!user?.id) return;

    const payload: PostWorklog = {
      ...values,
      userId: user.id,
      projectId: values.projectId?.id || '',
      workDate: sFormat(values.workDate, DATE_FORMATS.short_dashed),
    };

    createWorklog(payload, {
      onSuccess: () => {
        toast.success('Время добавлено');
        closeDialog();
        reset();
      },
      onError: (error) => parseApiErrors({ error, setError }),
    });
  });

  const handleClose = () => {
    if (isDirty) {
      openCloseDialogAlert({
        onSave: onSubmit,
        onDismiss: closeDialog,
      });
      return;
    }
    closeDialog();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className='max-w-lg'>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} className='flex flex-col'>
            <DialogHeader>
              <DialogTitle>{isViewMode ? 'Просмотр' : 'Записать время'}</DialogTitle>
            </DialogHeader>

            <DialogBody className='space-y-4'>
              <FormVirtualCombobox
                name={WORKLOG_FIELDS.PROJECT_ID}
                label='Проект'
                required
                options={options}
                disabled={optionIsPending}
              />

              <FormDatePicker name={WORKLOG_FIELDS.WORK_DATE} label='Дата' required />

              <FormInput name={WORKLOG_FIELDS.SPENT_MINUTES} label='Минуты' type='number' required />

              <FormVoiceTextarea name={WORKLOG_FIELDS.DESCRIPTION} label='Комментарий' />
            </DialogBody>

            <DialogFooter>
              <DialogButtonGroup handleClose={handleClose} disabled={isPending} />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
