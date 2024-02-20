import { AvalibleSlotsWidget } from '../../../interfaces/DashboardModels';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomCalendarEvent } from 'src/interfaces/CustomCalendarEvent';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  public storedEvents: Subject<CustomCalendarEvent[]> = new Subject();
  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public getCalendarEvents(): Observable<CustomCalendarEvent[]> {
    return this.http.get<CustomCalendarEvent[]>(
      `${this.API_URL}/calendar-events/`
    );
  }

  public postCalendarEvent(
    value: CustomCalendarEvent
  ): Observable<CustomCalendarEvent> {
    return this.http.post<CustomCalendarEvent>(
      `${this.API_URL}/calendar-events/`,
      value
    );
  }

  public deleteCalendarEvent(id: number): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/calendar-events/${id}`);
  }

  public getCalendarEventsByUserId(
    id: number
  ): Observable<CustomCalendarEvent[]> {
    return this.http.get<CustomCalendarEvent[]>(
      `${this.API_URL}/calendar-events/user/${id}`
    );
  }

  public editCalendarEventById(
    id: number,
    event: CustomCalendarEvent
  ): Observable<CustomCalendarEvent> {
    return this.http.put<CustomCalendarEvent>(
      `${this.API_URL}/calendar-events/${id}`,
      event
    );
  }

  public getAvalibleSlots(): Observable<AvalibleSlotsWidget> {
    return this.http.get<AvalibleSlotsWidget>(
      `${this.API_URL}/available-slots/`
    );
  }
}
