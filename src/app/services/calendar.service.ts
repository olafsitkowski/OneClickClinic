import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  public storedEvents: Subject<CustomCalendarEvent[]> = new Subject();
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getCalendarEvents(): Observable<CustomCalendarEvent[]> {
    return this.http.get<CustomCalendarEvent[]>(
      `${this.API_URL}/calendarEvent/`
    );
  }

  public postCalendarEvent(
    value: CustomCalendarEvent
  ): Observable<CustomCalendarEvent> {
    return this.http.post<CustomCalendarEvent>(
      `${this.API_URL}/calendarEvent/`,
      value
    );
  }

  public deleteCalendarEvent(id: number): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/calendarEvent/${id}`);
  }
}
