import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getCalendarEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.API_URL}/calendarEvent/`);
  }

  public postCalendarEvent(value: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(
      `${this.API_URL}/calendarEvent/`,
      value
    );
  }
}
