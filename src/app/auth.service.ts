import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogService } from './services/log';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://192.168.10.40:3000/api';

  constructor(private http: HttpClient, private log: LogService) {}

  // REGISTER
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // LOGIN (expects { token })
  loginUser(loginData: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      loginData
    );
  }

  // STORE TOKEN (KEY MUST MATCH INTERCEPTOR)
  storeToken(token: string, userId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }

  // GET TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // LOGOUT
  logout(): void {
    this.log.log('LOGOUT');
    localStorage.removeItem('token');
  }

  // AUTH CHECK
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  verifyMfa(data: {userId: string; code: string }) {
    return this.http.post('/api/mfa', data);
  }
}


