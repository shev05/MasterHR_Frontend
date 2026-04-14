import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';
import { useCallback, useMemo } from 'react'; // Добавьте useMemo

import { useProjectUsersMutate, useUsersProject } from '@/api/endpoints/project';
import { useUserList } from '@/api/endpoints/user';
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
import { Button } from '@/shared/components/ui/button';
import { FormSelect } from '@/shared/components/controls/select/form-select';
import { ALL_ELEMENTS_QUERY } from '@/shared/constants';
import { FormVirtualCombobox } from '@/shared/components/controls';

import {
  createProjectUsersFormValues,
  PROJECT_USERS_BASE_SCHEMA,
  PROJECT_USERS_DEFAULT_VALUES,
  ROLE_OPTIONS,
} from './project-user-mutate.lib';

import type { BaseDialogProps } from '@/shared/interface';
import type { GetProject } from '@/api/endpoints/project';
import type { ProjectUsersFormValue } from './project-user-mutate.lib';
import type { FC } from 'react';

type ProjectUsersMutateDialogProps = BaseDialogProps & {
  projectId: GetProject['id'];
};

export const ProjectUsersMutateDialog: FC<ProjectUsersMutateDialogProps> = ({ projectId, closeDialog }) => {
  const { mutate, isPending: mutatePending } = useProjectUsersMutate();
  const { data: projectUsers, isPending: projectUsersPending } = useUsersProject({ projectId });
  const { options: allUsersOptions, isPending: allUsersPending } = useUserList({
    queries: ALL_ELEMENTS_QUERY,
  });

  const roleOptionsAsStrings = useMemo(() => {
    return ROLE_OPTIONS.map((option) => ({
      ...option,
      value: String(option.value),
    }));
  }, []);

  const form = useForm<ProjectUsersFormValue>({
    defaultValues: PROJECT_USERS_DEFAULT_VALUES,
    values: createProjectUsersFormValues(projectUsers || [], allUsersOptions),
    resolver: yupCustomResolver({
      validationSchema: PROJECT_USERS_BASE_SCHEMA,
    }),
  });

  const { control, handleSubmit, formState, reset, setError } = form;
  const { isDirty } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users',
  });

  const { openCloseDialogAlert } = useCloseDialogAlert();

  const handleAppendUser = useCallback(() => {
    append({ id: '', role: '0' });
  }, [append]);

  const handleRemoveUser = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const handleFormSubmit = handleSubmit((formValues) => {
    const data = {
      users: (formValues.users || [])
        .filter((user) => user.id?.value)
        .map((user) => ({
          id: user.id.value,
          role: typeof user.role === 'string' ? parseInt(user.role, 10) : user.role,
        })),
    };

    const mutationConfig = {
      onSuccess: () => {
        toast.success('Сотрудник успешно обновлены');
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

  console.debug(allUsersOptions);

  const isLoading = projectUsersPending || allUsersPending;

  console.debug(form.getValues());

  return (
    <Dialog onOpenChange={handleDialogClose} open>
      <DialogContent className='max-w-2xl'>
        <SuspenseWrapper condition={isLoading} fallback={<CenteredSpinner />}>
          <FormProvider {...form}>
            <form noValidate onSubmit={handleFormSubmit} className='flex flex-col justify-between overflow-hidden'>
              <DialogHeader>
                <DialogTitle>Управление сотрудниками проекта</DialogTitle>
                <SuspenseWrapper>
                  <DialogDescription>Добавляйте и удаляйте сотрудников, назначайте им роли</DialogDescription>
                </SuspenseWrapper>
              </DialogHeader>

              <DialogBody className='space-y-4 pb-4'>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex items-end gap-2'>
                    <FormVirtualCombobox
                      name={`users.${index}.id`}
                      options={allUsersOptions}
                      placeholder='Сотрудник'
                      label='Сотрудник'
                      required
                    />

                    <FormSelect
                      name={`users.${index}.role`}
                      placeholder='Роль'
                      label='Роль'
                      options={roleOptionsAsStrings}
                      required
                    />

                    <Button type='button' variant='ghost' onClick={() => handleRemoveUser(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}

                <Button type='button' variant='outline' onClick={handleAppendUser} className='flex gap-2'>
                  <Plus size={16} />
                  Добавить сотрудника
                </Button>
              </DialogBody>

              <DialogFooter className='relative'>
                <DialogButtonGroup disabled={mutatePending} handleClose={handleDialogClose} />
              </DialogFooter>
            </form>
          </FormProvider>
        </SuspenseWrapper>
      </DialogContent>
    </Dialog>
  );
};
