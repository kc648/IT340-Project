import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../auth.service'; // <-- Use the Service
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(
    private authService: AuthService, // <-- Use the Service
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = null; 
    
    const loginData = { email: this.email, password: this.password };

    this.authService.loginUser(loginData).subscribe({
      next: (response: any) => {
        if (response.token) {
          this.authService.storeToken(response.token); // Store token via service
          this.router.navigate(['/add-entry']); 
        } else {
           this.errorMessage = 'Login succeeded but no authentication token was received.';
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error ? error.error.msg : 'Invalid credentials or server error.';
      }
    });
  }
}
