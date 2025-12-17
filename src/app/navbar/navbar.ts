import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  // ONE button for login/logout
  handleAuthButton() {
    if (this.auth.isLoggedIn()) {
      // Logged in → logout + redirect
      this.auth.logout();
      this.router.navigate(['/login']);
    } else {
      // Logged out → go to login page
      this.router.navigate(['/login']);
    }
  }
}


