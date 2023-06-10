import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  public openConfirmationDialog(data: any): MatDialogRef<any> {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: data,
    });
  }
}
