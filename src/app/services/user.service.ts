import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './../../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/user/`);
  }

  public getUser(user: User): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/user/${user.id}`);
  }

  public postUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/user/`, user);
  }
}
