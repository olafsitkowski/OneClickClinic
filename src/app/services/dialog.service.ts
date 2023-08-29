import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public openConfirmationDialog(data: any): MatDialogRef<any> {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: data,
    });
  }
}
