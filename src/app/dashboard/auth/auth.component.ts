import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      MatCheckboxModule,
      TranslateModule,
      HeaderComponent,
      RegistrationFormComponent
    ]
})
export class AuthComponent {
  // Variables
  isLoginPage: Boolean = false;
  showVerification: Boolean = false;
  token: string | null = null;
  verifyPageContent: any;
  passwordVisible: boolean = false; // Add this

  // Login form
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  // Register form (with expanded fields)
  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  constructor(private route: ActivatedRoute, private http: HttpService, public utils: UtilsService) { }

  ngOnInit() {
    // Check if the current route is '/login' or '/register'
    this.route.url.subscribe(urlSegment => {
      this.isLoginPage = urlSegment[0]?.path === 'login';
    });

    // Capture the token from the route parameter 'token'
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
      if (this.token) {
        this.verifyPageContent = `Verifying ...`;
        this.verifyAccount();
      }

      if (this.utils.isAuthenticated() && !this.token) {
        return this.utils.navigateTo('dashboard');
      }
    });
  }

  // Submit login form
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.http.login(this.loginForm.value).subscribe((res: any) => {
        this.utils.saveToken(res.accessToken);
        this.utils.navigateTo('dashboard');
      }, (error: any) => {
        if (error.status === 401) {
          alert('Unauthorized!');
        } else {
          alert('Error during login');
        }
      });
    } else {
      alert('Invalid login form');
    }
  }

  // Submit register form
  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      this.http.register(this.registerForm.value).subscribe((res: any) => {
        if (res.accessToken) {
          this.utils.saveToken(res.accessToken);
          this.utils.navigateTo('dashboard');
        } else {
          this.showVerification = true;
        }
      }, (error: any) => {
        if (error.status === 409) {
          alert('Already Registered !');
        } else {
          alert('Error during registration');
        }
      });
    } else {
      alert('Invalid registration form');
    }
  }

  // Method to call the API and verify the account
  verifyAccount() {
    if (this.token) {
      this.showVerification = true;
      this.http.verifyAccount(this.token).subscribe((response: any) => {
        this.verifyPageContent = `Account Verified! Navigating to login...`;
        setTimeout(() => {
          this.utils.navigateTo('login');
        }, 3500);
        console.log('Account verified successfully:', response);
      }, (error: any) => {
        this.verifyPageContent = `Token Expired! Navigating to register...`;
        setTimeout(() => {
          this.utils.navigateTo('register');
        }, 3500);
      });
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
