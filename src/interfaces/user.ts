import { Address } from './Address';

export interface User {
  id: number;
  role: string;
  email: string;
  password: string;
  password2?: string;
  name: string;
  surname: string;
  pesel?: string;
  adress: Address;
  phone_number: string;
}
