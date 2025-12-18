import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../auth.service'; // <-- Use the Service
import { HttpErrorResponse } from '@angular/common/http';
import { LogService } from '../services/log';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  loginStep: 'login' | 'mfa' = 'login';
  mfaUserId: string | null= null;
  mfaCode: string = '';  



  constructor(
    private authService: AuthService, // <-- Use the Service
    private router: Router,
    private log: LogService
  ) {}

  onLogin(): void {
    this.log.log('LOGIN_ATTEMPT');

    this.errorMessage = null; 
    
    const loginData = { email: this.email, password: this.password };

    this.authService.loginUser(loginData).subscribe({
      next: (response: any) => {
// 🔐 MFA REQUIRED
  if (response.mfaRequired) {
    this.loginStep = 'mfa';
    this.mfaUserId = response.userId;
    return;
  }

  // ✅ NORMAL LOGIN (no MFA)
  if (response.token) {
    this.authService.storeToken(response.token, response.userId);
    this.log.log('LOGIN_SUCCESS'); 
    this.router.navigate(['/calendar']);
  } else {
    this.errorMessage =
      'Login succeeded but no authentication token was received.';
  }

       
      },
      error: (error: HttpErrorResponse) => {
        this.log.log('LOGIN_FAILURE');
	this.errorMessage = error.error ? error.error.msg : 'Invalid credentials or server error.';
      }
    });
  }
verifyMfa(): void {
  if (!this.mfaUserId) return;

  this.authService.verifyMfa({
    userId: this.mfaUserId,
    code: this.mfaCode
  }).subscribe({
    next: (response: any) => {
      this.authService.storeToken(response.token, response.userId);
      this.log.log('MFA_SUCCESS');
      this.log.log('LOGIN_VERIFIED_SUCCESS');
	this.router.navigate(['/calendar']);
    },
    error: (error: HttpErrorResponse) => {
	this.log.log('MFA_FAILURE');
	this.errorMessage =
        error.error?.msg || 'Invalid or expired verification code.';
    }
  });
}



}
