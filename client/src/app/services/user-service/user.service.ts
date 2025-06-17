import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User, UserProfile, UserType } from '../../../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/user/`);
  }

  public getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/user/${userId}`);
  }

  public postUser(user: User): Observable<User> {
    const data = {
      profile: {
        ...user,
      },
    };
    return this.http.post<User>(`${this.API_URL}/user/`, data);
  }

  public getPatients(): Observable<User[]> {
    return this.getUsers().pipe(
      map((users: User[]) =>
        users.filter((user) => user.profile?.role === UserType.PATIENT)
      )
    );
  }

  public patchUserProfile(
    userProfile: UserProfile,
    userId: string
  ): Observable<User> {
    const data = {
      profile: {
        ...userProfile,
      },
    };
    return this.http.put<User>(`${this.API_URL}/user/${userId}`, data);
  }

  public getDoctors(): Observable<User[]> {
    return this.getUsers().pipe(
      map((users: User[]) =>
        users.filter((user) => user.profile?.role === UserType.DOCTOR)
      )
    );
  }

  public deleteUser(id: string): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/user/${id}`);
  }

  public getSpecializationList(): Observable<{ name: string; description: string }[]> {
    return this.http.get<{ name: string; description: string }[]>(
      `${this.API_URL}/specialization`
    );
  }
}
