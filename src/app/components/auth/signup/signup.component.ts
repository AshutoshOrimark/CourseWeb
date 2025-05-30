import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirstkeyPipe } from '../../../pipes/firstkey.pipe';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FirstkeyPipe],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  form: FormGroup;
  isSubmitted: boolean = false;

  // Password match validator
  passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router // Inject Router
  ) {
    // Form initialization with validators
    this.form = this.formBuilder.group({
      name: ['', Validators.required], // Changed from fullName to name
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[^a-zA-Z0-9])/)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d+$/)]], // Changed from phoneNumber to phone
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });  // Correct way to add the custom validator
  }

  ngOnInit(): void { }

  // Form submission handler
  async onSubmit(): Promise<void> {
    this.isSubmitted = true;
    if (this.form.valid) {
      try {
        const payload = {
          ...this.form.value,
          provider: 'local', // Added provider field
          role: 'User'       // Added role field
        };
        delete payload.confirmPassword; // Remove confirmPassword before sending to the API

        const response = await lastValueFrom(this.authService.createUser(payload));
        this.toastr.success('User created successfully!', 'Success', {
          timeOut: 3000,
        });
        this.cdr.detectChanges(); // Manually trigger change detection
        this.form.reset();
        this.isSubmitted = false;

        // Navigate to login component after successful signup
        this.router.navigate(['/login']);
      } catch (error: any) {
        console.log(error);
        if (error?.error?.detail?.includes('Duplicate entry')) {
          this.toastr.error('Email already exists. Please use a different email.', 'Error', {
            timeOut: 3000,
          });
        } else {
          this.toastr.error('Something went wrong!', 'Error', {
            timeOut: 3000,
          });
        }
      }
    } else {
      this.toastr.info('Please fill the form correctly!', 'Error', {
        timeOut: 3000,
      });
    }
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty));
  }
}
