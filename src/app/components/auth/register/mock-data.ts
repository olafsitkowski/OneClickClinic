import { RegisterForm } from 'src/interfaces/RegisterForm';

export const mockStateList: string[] = [
  'Dolnośląskie',
  'Kujawsko-pomorskie',
  'Lubelskie',
  'Lubuskie',
  'Łódzkie',
  'Małopolskie',
  'Mazowieckie',
  'Opolskie',
  'Podkarpackie',
  'Podlaskie',
  'Pomorskie',
  'Śląskie',
  'Świętokrzyskie',
  'Warmińsko-mazurskie',
  'Wielkopolskie',
  'Zachodniopomorskie',
];

export const mockRegisterInfoFormFields: RegisterForm[] = [
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

export const mockAddressformFields: RegisterForm[] = [
  {
    name: 'street',
    label: 'Street',
    type: 'text',
    controlName: 'street',
    class: 'street',
  },
  {
    name: 'houseNumber',
    label: 'House number',
    type: 'text',
    controlName: 'house_number',
    class: 'house-number',
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    controlName: 'city',
    class: 'city',
  },
  {
    name: 'state',
    label: 'State',
    type: 'select',
    controlName: 'state',
    class: 'state',
    options: mockStateList,
  },
  {
    name: 'postalCode',
    label: 'Postal code',
    type: 'text',
    controlName: 'postal_code',
    class: 'postal-code',
  },
];
