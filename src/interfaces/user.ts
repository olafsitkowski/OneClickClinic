import { CustomCalendarEvent } from './CustomCalendarEvent';

export interface User {
  id: number;
  authentication: {
    email: string;
    password: string;
    sessionToken?: string;
    salt?: string;
    userName: string;
  };
  profile: {
    role: string;
    name: string;
    surname: string;
    contact_email: string;
    bloodGroup?: string;
    phoneNumber?: string;
    gender?: string;
    address?: string;
    treatment?: string;
    pesel?: string;
    appointments?: CustomCalendarEvent[]; // Assuming the appointments are stored as an array of ObjectIds
  };
}

export enum UserType {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}
