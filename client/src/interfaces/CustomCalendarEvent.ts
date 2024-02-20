export interface CustomCalendarEvent {
  id?: number | string;
  employeeId?: number | string;
  patientId?: number | string;
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
  reason?: string;
  color?: EventColor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions?: any;
  type?: string;
}

export interface EventColor {
  primary: string;
  secondary: string;
  secondaryText?: string;
}
