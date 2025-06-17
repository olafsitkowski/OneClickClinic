import { CustomCalendarEvent } from './CustomCalendarEvent';

export interface User {
  _id: string;
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

interface WeeklySchedule {
  monday?: { start: string; end: string };
  tuesday?: { start: string; end: string };
  wednesday?: { start: string; end: string };
  thursday?: { start: string; end: string };
  friday?: { start: string; end: string };
  saturday?: { start: string; end: string };
  sunday?: { start: string; end: string };
}

interface UserAddress {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  _id: string;
  role: string;
  name: string;
  surname: string;
  specialization?: {
    name: string;
    description: string;
  };
  contactEmail: string;
  bloodGroup?: string;
  phoneNumber?: string;
  gender?: string;
  address?: UserAddress;
  treatment?: string;
  pesel?: string;
  appointments?: CustomCalendarEvent[];
  weeklySchedule?: WeeklySchedule;
}

export enum UserType {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}
