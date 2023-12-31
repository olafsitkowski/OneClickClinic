export interface SimpleWidget {
  icon: string;
  description: string;
  count: number;
}

export interface WidgetAppointment {
  title?: string;
  start?: Date;
  end?: Date;
  employeeId?: number | string;
  patientId?: number | string;
}

export interface AvalibleSlotsWidget {
  labels: string[];
  datasets: [
    {
      busySlots: string[];
      availableSlots: string[];
    }
  ];
}
