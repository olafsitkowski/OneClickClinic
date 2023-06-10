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
  actions?: any;
}
