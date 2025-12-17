import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../auth.service'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], 
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService, // <-- Use the Service
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = null;
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Error: Passwords do not match.";
      return; 
    }
    
    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.registerUser(userData).subscribe({
      next: (response: any) => {
        alert('Registration complete! Redirecting to login.');
        this.router.navigate(['/login']); 
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error ? error.error.msg : 'A network or server error occurred.';
      }
    });
  }
}
