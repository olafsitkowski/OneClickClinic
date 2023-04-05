import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from 'src/interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private userService: UserService) {}

  public userIdentification(
    email: string,
    password: string
  ): Observable<User | undefined> {
    return this.userService
      .getUsers()
      .pipe(
        map((userList: User[]) =>
          userList.find(
            (user) => user.password === password && user.email === email
          )
        )
      );
  }
}
