import { CanActivateFn } from '@angular/router';

export const authenticationGuard: CanActivateFn = () => {
  return localStorage.getItem('token') ? true : false;
};

export const registerGuard: CanActivateFn = () => {
  return localStorage.getItem('isFirstLogin') ? true : false;
};
