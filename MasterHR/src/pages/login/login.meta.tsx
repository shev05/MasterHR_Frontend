import { LoginForm } from './ui/login';
import { RegisterForm } from './ui/register';

export const LOGIN_PAGES_TABS = [
  {
    value: 1,
    label: 'Авторизация',
    content: <LoginForm />,
  },
  {
    value: 2,
    label: 'Регистрация',
    content: <RegisterForm />,
  },
];

export const deafultTab = LOGIN_PAGES_TABS[0].value;
