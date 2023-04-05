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
    name: 'password',
    label: 'Haslo',
    type: 'password',
    controlName: 'password',
    class: 'password',
    autocomplete: 'on',
  },
  {
    name: 'password-match',
    label: 'Powtorz haslo',
    type: 'password',
    controlName: 'password2',
    class: 'password-match',
    autocomplete: 'on',
  },
  {
    name: 'phoneNumber',
    label: 'Numer telefonu',
    type: 'text',
    controlName: 'phoneNumber',
    class: 'phone-number',
  },
  {
    name: 'name',
    label: 'Imie',
    type: 'text',
    controlName: 'name',
    class: 'name',
  },
  {
    name: 'surname',
    label: 'Nazwisko',
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
    label: 'Ulica',
    type: 'text',
    controlName: 'street',
    class: 'street',
  },
  {
    name: 'houseNumber',
    label: 'Numer domu/mieszkania',
    type: 'text',
    controlName: 'house_number',
    class: 'house-number',
  },
  {
    name: 'city',
    label: 'Miasto',
    type: 'text',
    controlName: 'city',
    class: 'city',
  },
  {
    name: 'postalCode',
    label: 'Kod pocztowy',
    type: 'text',
    controlName: 'postal_code',
    class: 'postal-code',
  },
];
