import { CustomCalendarEvent } from './CustomCalendarEvent';

export interface User {
  id: number;
  role: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  bloodGroup: string;
  phoneNumber: string;
  gender: string;
  address: string;
  treatment?: string;
  pesel?: string;
  appointments?: CustomCalendarEvent[];
}

export enum UserType {
  PATIENT = 'patient',
  EMPLOYEE = 'employee',
}
