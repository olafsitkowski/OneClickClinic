import { Component } from '@angular/core';

export interface PatientData {
  name: string;
  surname: string;
  position: number;
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent {
  public ELEMENT_DATA: PatientData[] = [
    { position: 1, name: 'John', surname: 'Doe' },
    { position: 2, name: 'Donald', surname: 'Joe' },
    { position: 3, name: 'Lithium', surname: 'Tree' },
    { position: 4, name: 'Beryllium', surname: 'Blue' },
    { position: 5, name: 'Boron', surname: 'Green' },
    { position: 6, name: 'Carbon', surname: 'Dot' },
    { position: 7, name: 'Nitrogen', surname: 'Bot' },
    { position: 8, name: 'Oxygen', surname: 'Pencil' },
    { position: 9, name: 'Fluorine', surname: 'Cat' },
    { position: 10, name: 'Neon', surname: 'Dog' },
  ];

  public displayedColumns: string[] = ['position', 'name', 'surname'];
  public dataSource = this.ELEMENT_DATA;
}
