import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent {
  @Input() registerForm!: FormGroup;
  @Input() passwordVisible: boolean = false;
  @Output() submit = new EventEmitter<void>();
  @Output() togglePassword = new EventEmitter<void>();
  @Output() navigateToLogin = new EventEmitter<void>();

  onSubmit(): void {
    this.submit.emit();
  }

  onTogglePassword(): void {
    this.togglePassword.emit();
  }

  onNavigateToLogin(): void {
    this.navigateToLogin.emit();
  }
}
