import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';

@Component({
  selector: 'app-appointment-details-dialog',
  templateUrl: './appointment-details-dialog.component.html',
  styleUrls: ['./appointment-details-dialog.component.scss'],
})
export class AppointmentDetailsDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<AppointmentDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomCalendarEvent
  ) {}

  public ngOnInit(): void {
  
  }

  public close(): void {
    this.dialogRef.close();
  }
}
