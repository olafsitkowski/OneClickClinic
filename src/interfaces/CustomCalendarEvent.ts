import { User } from './User';

export interface CustomCalendarEvent {
  eventName: string;
  eventUser: User;
  startDate: Date;
  endDate: Date;
}
