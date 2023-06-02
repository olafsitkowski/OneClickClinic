import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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

  public getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/user/${userId}`);
  }

  public postUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/user/`, user);
  }

  public getEmployees(): Observable<User[]> {
    return this.getUsers().pipe(
      map((users: User[]) => users.filter((user) => user.role === 'employee'))
    );
  }
}
