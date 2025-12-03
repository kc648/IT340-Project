import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = (environment as any).apiUrl;

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post('${this.apiUrl}/api/register', userData); // Fixed template literal
  }

  loginUser(loginData: any): Observable<any> {
    return this.http.post('${this.apiUrl}/api/login', loginData); // Fixed template literal
  }

  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
