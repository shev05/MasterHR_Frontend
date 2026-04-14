import { FormProvider, useForm } from 'react-hook-form';

import { useUserUpdate } from '@/api/endpoints/user';
import { yupCustomResolver } from '@/shared/lib/yup-custom-resolver';
import { useCloseDialogAlert } from '@/shared/hooks/use-close-dialog-alert';
import { toast } from '@/shared/components/app-toaster';
import { parseApiErrors } from '@/api/http-client';
import { PLACEHOLDERS } from '@/shared/constants/placeholders';
import { FormVoiceInput } from '@/shared/components/controls/voice-input';
import { FormPhoneInput } from '@/shared/components/controls/number-input';
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

import {
  createUserInfoFormValues,
  USER_INFO_BASE_SCHEMA,
  USER_INFO_DEFAULT_VALUES,
  USER_INFO_FIELDS,
} from './user-info-mutate.lib';

import type { BaseDialogProps } from '@/shared/interface';
import type { GetUser, PutUser } from '@/api/endpoints/user';
import type { FC } from 'react';
import type { UserInfoFormValue } from './user-info-mutate.lib';

type UserInfoMutateDialogProps = BaseDialogProps &
  PutUser & {
    userId: GetUser['id'];
  };

export const UserInfoMutateDialog: FC<UserInfoMutateDialogProps> = ({
  name,
  surname,
  patronymic,
  phoneNumber,
  position,
  userId,
  closeDialog,
}) => {
  const { mutate: update, isPending } = useUserUpdate();

  const form = useForm<UserInfoFormValue>({
    defaultValues: USER_INFO_DEFAULT_VALUES,
    values: createUserInfoFormValues({ name, surname, patronymic, phoneNumber, position }),
    resolver: yupCustomResolver({ validationSchema: USER_INFO_BASE_SCHEMA }),
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

    update({ userId, data: formValues }, mutationConfig);
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
      <DialogContent className='max-w-xl'>
        <FormProvider {...form}>
          <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
            <DialogHeader>
              <DialogTitle>{'Изменит информацию'}</DialogTitle>
              <SuspenseWrapper>
                <DialogDescription>{PLACEHOLDERS.dialog}</DialogDescription>
              </SuspenseWrapper>
            </DialogHeader>
            <DialogBody className={'pb-4'}>
              <FormVoiceInput name={USER_INFO_FIELDS.NAME} label='Имя' required />
              <FormVoiceInput name={USER_INFO_FIELDS.SURNAME} label='Фамилия' required />
              <FormVoiceInput name={USER_INFO_FIELDS.PATRONYMIC} label='Отчество' required />
              <FormVoiceInput name={USER_INFO_FIELDS.POSITION} label='Должность' required />
              <FormPhoneInput name={USER_INFO_FIELDS.PHONE_NUMBER} label='Номер телефона' required />
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
