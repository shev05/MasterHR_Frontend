import { FormProvider, useForm } from 'react-hook-form';

import { optionSkillsLevel, useSkillsAdd } from '@/api/endpoints/skills';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';
import { toast } from '@/shared/components/app-toaster';
import {
  Dialog,
  DialogBody,
  DialogButtonGroup,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';
import { FormSelect } from '@/shared/components/controls';
import { parseApiErrors } from '@/api/http-client';
import { FormVoiceInput } from '@/shared/components/controls/voice-input';

import { CREATE_SKILLS_FIELDS_SCHEMA, SKILLS_FIELDS } from './user-skills-add.lib';

import type { BaseDialogProps } from '@/shared/interface';
import type { FC } from 'react';
import type { CreateUserSkillsFormValue } from './user-skills-add.lib';

type UserSkillsCreateDialogProps = BaseDialogProps;

export const UserSkillsCreateDialog: FC<UserSkillsCreateDialogProps> = ({ closeDialog }) => {
  const { mutate: skillsAdd, isPending: skillsAddIsPending } = useSkillsAdd();

  const form = useForm<CreateUserSkillsFormValue>({
    resolver: yupCustomResolver({ validationSchema: CREATE_SKILLS_FIELDS_SCHEMA }),
  });

  const { handleSubmit, formState, reset, setError } = form;
  const { isDirty } = formState;

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const handleFormSubmit = handleSubmit((formValues) => {
    skillsAdd(
      {
        ...formValues,
        years: formValues.years || 0,
      },
      {
        onSuccess: () => {
          toast.success('Навыки успешно создан');
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
      <DialogContent className='max-w-2xl'>
        <FormProvider {...form}>
          <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
            <DialogHeader>
              <DialogTitle>Создание навыка</DialogTitle>
              <DialogDescription>Заполните информацию о навыке</DialogDescription>
            </DialogHeader>

            <DialogBody className='space-y-4 pb-4'>
              <FormVoiceInput
                name={SKILLS_FIELDS.NAME}
                label='Название навыка'
                placeholder='Введите название скилла'
                required
              />
              <FormVoiceInput name={SKILLS_FIELDS.YEARS} label='Лет опыта' placeholder='Введите сколько лет' required />
              <FormSelect
                name={SKILLS_FIELDS.LEVEL}
                options={optionSkillsLevel}
                label='Уровень'
                placeholder='Выберите уровень'
                required
              />
            </DialogBody>

            <DialogFooter className='relative'>
              <DialogButtonGroup disabled={skillsAddIsPending} handleClose={handleDialogClose} />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
