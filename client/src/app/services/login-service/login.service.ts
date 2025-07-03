import { User } from '../../../interfaces/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface EmployeeRegisterForm {
  authentication: {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  };
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}
  private readonly API_URL = 'http://localhost:8080';

  public userLogin(
    email: string,
    password: string
  ): Observable<{ user: User; token: string } | null> {
    return this.http
      .post<{ user: User; token: string }>(`${this.API_URL}/login`, {
        email,
        password,
      })
      .pipe(
        tap((res: { user: User; token: string }) => {
          if (res.user && res.token) {
            localStorage.setItem('token', res.token);
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
  }

  public registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, user);
  }

  public registerEmployeeAccount(
    user: EmployeeRegisterForm
  ): Observable<EmployeeRegisterForm> {
    return this.http.put<EmployeeRegisterForm>(
      `${this.API_URL}/user/auth/${user.userId}`,
      user
    );
  }

  public isFirstLogin(): Observable<boolean> {
    return this.http.get<User[]>(`${this.API_URL}/user/`).pipe(
      map((users: User[]) => {
        return users.length === 0;
      })
    );
  }
}
