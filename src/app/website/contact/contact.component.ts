import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpService } from '@src/app/services/http.service';

/** Rejects values that are empty or whitespace only. */
function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value?.trim() ? null : { required: true };
}

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly httpService = inject(HttpService);

  @ViewChild(FormGroupDirective) private formDirective!: FormGroupDirective;

  protected readonly isSubmitting = signal(false);
  protected readonly hasSubmitted = signal(false);
  protected readonly hasSubmitError = signal(false);

  protected readonly contactForm = this.fb.nonNullable.group({
    name: ['', [notBlank, Validators.maxLength(100)]],
    email: ['', [notBlank, Validators.email, Validators.maxLength(254)]],
    subject: ['', [Validators.required]],
    message: ['', [notBlank, Validators.maxLength(5000)]],
    consent: [false, [Validators.requiredTrue]],
  });

  protected onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting()) {
      this.contactForm.markAllAsTouched();
      this.contactForm.markAsPristine();
      return;
    }

    // Read the value BEFORE disabling the form (disabled controls are excluded from .value)
    const payload = this.contactForm.getRawValue();

    this.isSubmitting.set(true);
    this.hasSubmitted.set(false);
    this.hasSubmitError.set(false);
    this.contactForm.disable();

    this.httpService.sendContactMessage(payload).subscribe({
      next: () => {
        this.contactForm.enable();
        this.formDirective.resetForm(); // Reset controls and the directive's submitted state.
        this.isSubmitting.set(false);
        this.hasSubmitted.set(true);
      },
      error: () => {
        this.contactForm.enable();
        this.isSubmitting.set(false);
        this.hasSubmitError.set(true);
      },
    });
  }
}
