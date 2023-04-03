import { Address } from './address';

export interface User {
  id: number;
  role: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  pesel?: string;
  adress: Address;
}
