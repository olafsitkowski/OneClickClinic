import { CanActivateFn } from '@angular/router';

export const authenticationGuard: CanActivateFn = () => {
  return localStorage.getItem('token') ? true : false;
};
