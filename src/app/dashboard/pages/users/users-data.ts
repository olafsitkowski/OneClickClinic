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
  name: 'Name',
  surname: 'Surname',
  contactEmail: 'Email',
  phoneNumber: 'Phone number',
  pesel: 'PESEL',
  role: 'Role',
  street: 'Street',
  houseNumber: 'House number',
  city: 'City',
  postalCode: 'Postal code',
  state: 'State',
};

export const userFromFields: RegisterForm[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    controlName: 'email',
    class: 'email',
  },
  {
    name: 'phoneNumber',
    label: 'Phone number',
    type: 'text',
    controlName: 'phoneNumber',
    class: 'phone-number',
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    controlName: 'name',
    class: 'name',
  },
  {
    name: 'surname',
    label: 'Surname',
    type: 'text',
    controlName: 'surname',
    class: 'surname',
  },
  {
    name: 'pesel',
    label: 'Pesel',
    type: 'text',
    controlName: 'pesel',
    class: 'pesel',
  },
];
