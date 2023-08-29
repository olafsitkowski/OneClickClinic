export interface CustomCalendarEvent {
  id?: number | string;
  employeeId?: number;
  patientId?: number;
  start: Date;
  end?: Date;
  title: string;
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions?: any;
}
