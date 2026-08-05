import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '@src/app/services/utils.service';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { SignatureFieldComponent } from './signature-field/signature-field.component';
import { email } from '@angular/forms/signals';
import { FieldErrorComponent } from '@src/app/shared/components/form-field-error/form-field-error.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { OnSubmitErrorStateMatcher } from '@src/app/shared/onSubmitErrorStateMatcher';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  standalone: true,
  providers: [{ provide: ErrorStateMatcher, useClass: OnSubmitErrorStateMatcher }],
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatCard,
    MatCheckbox,
    MatInput,
    MatButton,
    SignatureFieldComponent,
    TranslatePipe,
    MatError,
    FieldErrorComponent,
  ],
})
export class ApplicationFormComponent implements OnInit {
  public isLoginPage = false;
  public applicationForm: FormGroup;
  public isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private utils: UtilsService,
  ) {
    this.applicationForm = this.fb.group({
      firstName: ['', Validators.required],
      fathersName: [''],
      lastName: ['', Validators.required],
      embg: ['', Validators.pattern('^[0-9]{13}$')],
      address: ['', Validators.required],
      municipality: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      education: ['', Validators.required],
      profession: ['', Validators.required],
      employerName: [''],
      position: [''],
      companyName: ['', Validators.required],
      nameDay: [''],
      signature: [null, Validators.required],
      consent: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe((urlSegment) => {
      this.isLoginPage = urlSegment[0]?.path === 'login';
    });
  }

  public onSubmit(): void {
    if (this.applicationForm.valid) {
      this.isSubmitted = true;
      console.log('Form Submitted', this.applicationForm.value);
      // Simulate submission
      setTimeout(() => {
        // Reset or navigate
      }, 2000);
    }
  }

  protected readonly email = email;
}
