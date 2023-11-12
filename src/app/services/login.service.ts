import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/interfaces/User';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}
  private readonly API_URL = 'http://localhost:8080';

  // public userIdentification(
  //   email: string,
  //   password: string
  // ): Observable<User | undefined> {
  //   return this.userService
  //     .getUsers()
  //     .pipe(
  //       map((userList: User[]) =>
  //         userList.find(
  //           (user) => user.password === password && user.email === email
  //         )
  //       )
  //     );
  // }

  public userLogin(
    email: string,
    password: string
  ): Observable<{ user: User; token: string }> {
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
        })
      );
  }
}
