import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { encryptData,decryptData } from '../../../../utils/crypto-util';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  constructor(private router: Router) {}

  userName: string = decryptData(localStorage.getItem('user_name') ?? '');
  

  logout(): void {
    // Clear all relevant keys from local storage   
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('dark-mode');
    localStorage.removeItem('access_token');

    // Redirect to the login page using window.location.href
    window.location.href = '/login'; // Replace '/login' with your actual login route
  }

  sidebarToggle(): void {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('collapsed');

    
  }
}
