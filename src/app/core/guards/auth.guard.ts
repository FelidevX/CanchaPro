import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  console.log('TOKEN:', token, 'ROLE:', role); // <-- Agrega esto
  if (token && role) {
    if (role === 'dueno') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
  this.router.navigate(['/auth/login']);
  return false;
}
}