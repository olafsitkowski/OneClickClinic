import { RegisterForm } from './../../../../interfaces/RegisterForm';

export const patientColumns = [
  'name',
  'surname',
  'contactEmail',
  'phoneNumber',
  'pesel',
  'actions',
];

export const employeeColumns = [
  'name',
  'surname',
  'contactEmail',
  'phoneNumber',
  'role',
  'actions',
];

export const addressLabels = [
  'Street',
  'House number',
  'City',
  'Postal code',
  'State',
];

export const columnLabels: { [key: string]: string } = {
  name: 'NAME',
  surname: 'SURNAME',
  contactEmail: 'EMAIL',
  phoneNumber: 'PHONE_NUMBER',
  pesel: 'PESEL',
  role: 'ROLE',
  title: 'TITLE',
  start: 'START',
  end: 'END',
  patient: 'PATIENT',
  actions: 'ACTIONS',
};

export const userFormFields: RegisterForm[] = [
  {
    name: 'email',
    label: 'EMAIL',
    type: 'email',
    controlName: 'email',
    class: 'email',
  },
  {
    name: 'phoneNumber',
    label: 'PHONE_NUMBER',
    type: 'text',
    controlName: 'phoneNumber',
    class: 'phone-number',
  },
  {
    name: 'name',
    label: 'NAME',
    type: 'text',
    controlName: 'name',
    class: 'name',
  },
  {
    name: 'surname',
    label: 'SURNAME',
    type: 'text',
    controlName: 'surname',
    class: 'surname',
  },
  {
    name: 'pesel',
    label: 'PESEL',
    type: 'text',
    controlName: 'pesel',
    class: 'pesel',
  },
];
