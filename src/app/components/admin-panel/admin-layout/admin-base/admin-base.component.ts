import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminFooterComponent } from '../admin-footer/admin-footer.component';

@Component({
  selector: 'app-admin-base',
  imports: [AdminNavbarComponent, AdminSidebarComponent, RouterOutlet, AdminFooterComponent],
  templateUrl: './admin-base.component.html',
  styleUrl: './admin-base.component.css'
})
export class AdminBaseComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (!token || this.isTokenExpired(token)) {
      this.logout();
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (e) {
      return true; // If parsing fails, consider the token invalid
    }
  }

  logout(): void {
    // Clear all relevant keys from local storage   
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('dark-mode');
    localStorage.removeItem('access_token');

    // Redirect to the login page
    this.router.navigate(['/login']); // Replace '/login' with your actual login route
  }
}
