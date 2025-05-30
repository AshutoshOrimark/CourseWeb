import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirstkeyPipe } from '../../../pipes/firstkey.pipe';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import { encryptData } from '../../../utils/crypto-util';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, FirstkeyPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Added email validation
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.setTokenTimeout(token); // Set token timeout if already logged in
      this.router.navigate(['/admin/dashboard']); // Redirect if already logged in
    }
  }

  async onSubmit(): Promise<void> {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: (res: any) => {
          const token = res.access_token; // Extract the token
          localStorage.setItem('access_token', token); // Save the token in localStorage

          // Decode the token to extract claims
          const claims: any = jwtDecode(token);

          // Validate and convert claims to strings before encryption
          const userId = claims.id ? claims.id.toString() : '';
          const userName = claims.name || '';
          const userEmail = claims.email || '';
          const userRole = claims.role || '';

          // Encrypt and store claims in localStorage
          localStorage.setItem('user_id', encryptData(userId));
          localStorage.setItem('user_name', encryptData(userName));
          localStorage.setItem('user_email', encryptData(userEmail));
          localStorage.setItem('user_role', encryptData(userRole));

          this.setTokenTimeout(token); // Set token timeout after login
          this.router.navigate(['/admin/dashboard']); // Correct path
          this.toastr.success('Logged in successfully!', 'Success', {
            timeOut: 3000
          });
        },
        error: (err: any) => {
          if (err.error?.detail === 'Invalid email or password') {
            this.toastr.error('Invalid email or password!', 'Error', {
              timeOut: 3000
            });
          } else {
            console.log(err);
            this.toastr.error('Something went wrong!', 'Error', { timeOut: 3000 });
          }
        }
      });
    } else {
      this.toastr.info('Please fill the form correctly!', 'Error', {
        timeOut: 3000
      });
    }
  }

  setTokenTimeout(token: string): void {
    try {
      const payload: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeout = (payload.exp - currentTime) * 1000; // Calculate timeout in milliseconds

      if (timeout > 0) {
        setTimeout(() => {
          this.logout(); // Automatically log out when the token expires
        }, timeout);
      }
    } catch (e) {
      console.error('Failed to decode token:', e);
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
    this.toastr.info('Session expired. Please log in again.', 'Info', {
      timeOut: 3000
    });
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty));
  }
}
