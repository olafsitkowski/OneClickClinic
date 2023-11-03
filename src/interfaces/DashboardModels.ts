export interface SimpleWidget {
  icon: string;
  description: string;
  count: number;
}

export interface WidgetAppointment {
  title?: string;
  start?: Date;
  end?: Date;
  employeeId?: number;
  patientId?: number;
}
