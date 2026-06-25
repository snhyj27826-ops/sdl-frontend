import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { email, form, required } from '@angular/forms/signals';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  public isSubmitting = signal(false);
  protected readonly contactModel = signal({
    name: '',
    email: '',
    subject: 'general',
    message: '',
    consent: false,
  });
  
  constructor(private translate: TranslateService) {}

  protected readonly contactForm = form(this.contactModel, (rules) => {
    required(rules.name, { message: this.translate.instant('CONTACT_VALIDATION_NAME_REQUIRED') });
    required(rules.email, { message: this.translate.instant('CONTACT_VALIDATION_EMAIL_REQUIRED') });
    email(rules.email, { message: this.translate.instant('CONTACT_VALIDATION_EMAIL_INVALID') });
    required(rules.message, { message: this.translate.instant('CONTACT_VALIDATION_MESSAGE_REQUIRED') });
    required(rules.consent, { message: this.translate.instant('CONTACT_VALIDATION_CONSENT_REQUIRED') });
  });

  ngOnInit(): void {}

  public onSubmit(): void {
    if (this.contactForm().valid()) {
      this.isSubmitting.set(true);

      setTimeout(() => {
        alert(this.translate.instant('CONTACT_SUCCESS_MESSAGE'));
        this.isSubmitting.set(false);
        this.contactForm().reset();
      }, 1500);
    }
  }
}
