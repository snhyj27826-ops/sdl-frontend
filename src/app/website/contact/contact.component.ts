import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { AtmosphericCardDirective } from '@src/app/shared/directives/atmospheric-card.directive';

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
    FormField,
    AtmosphericCardDirective,
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
  protected readonly contactForm = form(this.contactModel, (rules) => {
    required(rules.name, { message: 'Име је обавезно' });
    required(rules.email, { message: 'Е-пошта је обавезна' });
    email(rules.email, { message: 'Унесите исправну е-пошту' });
    required(rules.message, { message: 'Порука је обавезна' });
    required(rules.consent, { message: 'Морате прихватити услове' });
  });

  ngOnInit(): void {}

  public onSubmit(): void {
    if (this.contactForm().valid()) {
      this.isSubmitting.set(true);

      setTimeout(() => {
        alert('Хвала вам на поруци!');
        this.isSubmitting.set(false);
        this.contactForm().reset();
      }, 1500);
    }
  }
}
