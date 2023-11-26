import { RegisterForm } from 'src/interfaces/RegisterForm';

export const mockRegisterInfoFormFields: RegisterForm[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    controlName: 'email',
    class: 'email',
  },
  {
    name: 'userName',
    label: 'User name',
    type: 'text',
    controlName: 'userName',
    class: 'name',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    controlName: 'password',
    class: 'password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    controlName: 'confirmPassword',
    class: 'confirm-password',
  },
];
