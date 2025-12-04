import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');

    // If no token → redirect to login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // If token exists → allow access
    return true;
  }
}

