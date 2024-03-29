import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { type: string; title: string; content: string },
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {}

  public confirmDialog(): void {
    this.dialogRef.close(true);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}
