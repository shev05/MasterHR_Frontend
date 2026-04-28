import * as Yup from 'yup';

export enum USER_ADD_PROJECT_FIELDS {
  ROLE = 'role',
}

export const USER_ADD_PROJECT_FIELDS_DEFAULT_VALUES = {
  [USER_ADD_PROJECT_FIELDS.ROLE]: 0,
};

export const CREATE_USER_ADD_PROJECT_FIELDS_SCHEMA = Yup.object({
  [USER_ADD_PROJECT_FIELDS.ROLE]: Yup.number().required('Выберите роль').oneOf([0, 1], 'Выберите роль'),
});

export type CreateUserAddProjectFormValue = Yup.InferType<typeof CREATE_USER_ADD_PROJECT_FIELDS_SCHEMA>;
