import * as Yup from 'yup';

/* DEFAULT VALUES FOR FIELDS
    number: 0
    string: ''
    boolean: false
    object(combobox,multiple-selector): null
*/

export const VAL_REGEXP = {
  AUTH: {
    EMAIL:
      /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/g,
    PASSWORD:
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?])[a-zA-Z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?]{10,50}/,
    CHANGE_PASSWORD: /^[!@#$%^&*()_+[\]{};':"\\|,.<>/?a-zA-Z0-9]+$/,
  },
  NUMERIC: {
    DIGITS_ONLY: /^\d*$/,
    NON_DIGIT_CHAR: /[^0-9]/g,
  },
  CONTENT: {
    IP: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  },
} as const;

export const VAL_MESSAGES = {
  AUTH: {
    CREDINTIALS: 'Введите верные логин и пароль!',
    PASSWORD_MISMATCH: 'Введенные пароли не совпадают!',
    PASSWORD_REQUIREMENTS:
      'Пароль должен иметь длину минимум 10 символов, содержать заглавные и прописные латинские буквы, цифры и спецсимвол.',
    REQUIERED_NEW_PASSWORD: 'Новый пароль обязателен.',
    REQUIERED_OLD_PASSWORD: 'Старый пароль обязателен.',
    CONFIRM_PASSWORD: 'Подтверждение пароля обязательно.',
  },
  FIELD: {
    REQUIRED: 'Обязательное поле',
    IP: 'Поле должно соответствовать формату IPv4',
    MAX_SIZE: (fieldName: Undefinable<string> = '', symbolCount: Undefinable<number> = 255) =>
      `Поле ${fieldName} не должно превышать ${symbolCount} символов.`,
    SIZE: (fieldName: Undefinable<string> = '', symbolCount: Undefinable<number> = 255) =>
      `Поле ${fieldName}  должно содержать ${symbolCount} символов.`,
  },
} as const;

//STRING
export const requiredString = (
  requiredMessage: Undefinable<string> = VAL_MESSAGES.FIELD.REQUIRED,
  fieldName: Undefinable<string> = ''
) => Yup.string().trim().required(requiredMessage).max(255, VAL_MESSAGES.FIELD.MAX_SIZE(fieldName, 255));

export const partialString = (fieldName: Undefinable<string> = '') =>
  Yup.string().trim().optional().max(255, VAL_MESSAGES.FIELD.MAX_SIZE(fieldName, 255));

//NUMBER
export const requiredNumber = (requiredMessage: Undefinable<string> = VAL_MESSAGES.FIELD.REQUIRED) =>
  Yup.number().required(requiredMessage).min(1, requiredMessage);
export const partialNumber = () =>
  Yup.number()
    .optional()
    .transform((value) => {
      return value === 0 || value === null ? undefined : value;
    });

//ARRAY
export const requiredArray = (requiredMessage: Undefinable<string> = VAL_MESSAGES.FIELD.REQUIRED) =>
  Yup.array().required(requiredMessage).min(1, requiredMessage);
export const partialArray = () => Yup.array();

//BOOLEAN
export const requiredBoolean = (requiredMessage: Undefinable<string> = VAL_MESSAGES.FIELD.REQUIRED) =>
  Yup.boolean().required(requiredMessage);

export const requiredBooleanTrue = (requiredMessage: Undefinable<string> = VAL_MESSAGES.FIELD.REQUIRED) =>
  Yup.boolean().required(requiredMessage).oneOf([true], requiredMessage);

//OPTION
export const requiredOption = (requiredMessage: Undefinable<string> = VAL_MESSAGES.FIELD.REQUIRED) =>
  Yup.object({
    id: requiredString(),
    value: requiredString(),
    label: requiredString(),
  })
    .required(VAL_MESSAGES.FIELD.REQUIRED)
    .nullable()
    .test('not-null-object', requiredMessage, (value) => {
      if (value === null || value === undefined) {
        return false;
      }

      return !(value.value === '' || value.id === '' || value.label === '');
    });
