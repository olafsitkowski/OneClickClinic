import { CustomCalendarEvent } from './CustomCalendarEvent';

export interface User {
  id: number;
  authentication: UserAuthentication;
  profile: UserProfile;
}

export interface UserAuthentication {
  email: string;
  password: string;
  sessionToken?: string;
  salt?: string;
  userName: string;
}

export interface UserProfile {
  id: number;
  role: string;
  name: string;
  surname: string;
  contactEmail: string;
  bloodGroup?: string;
  phoneNumber?: string;
  gender?: string;
  address?: string;
  treatment?: string;
  pesel?: string;
  appointments?: CustomCalendarEvent[];
}

export enum UserType {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}
