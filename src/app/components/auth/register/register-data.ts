import { RegisterForm } from 'src/interfaces/RegisterForm';

export const mockRegisterInfoFormFields: RegisterForm[] = [
  {
    name: 'email',
    label: 'EMAIL',
    type: 'email',
    controlName: 'email',
    class: 'email',
  },
  {
    name: 'userName',
    label: 'USER_NAME',
    type: 'text',
    controlName: 'userName',
    class: 'name',
  },
  {
    name: 'password',
    label: 'PASSWORD',
    type: 'password',
    controlName: 'password',
    class: 'password',
  },
  {
    name: 'confirmPassword',
    label: 'CONFIRM_PASSWORD',
    type: 'password',
    controlName: 'confirmPassword',
    class: 'confirm-password',
  },
];
