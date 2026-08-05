import { Component, inject, OnInit } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from '@src/app/shared/components/dialog/dialog.component';

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
  private dialog = inject(MatDialog);
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

  public openTermsDialog(): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '650px',
      maxHeight: '80vh',
      disableClose: false,
      data: {
        title: 'TERMS_DIALOG.TITLE',
        // HTML or plain text body for terms:
        content: 'TERMS_DIALOG.CONTENT',
        isHtml: true,
        confirmText: 'TERMS_DIALOG.ACCEPT',
        cancelText: 'TERMS_DIALOG.DECLINE',
        confirmColor: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((accepted: boolean) => {
      if (accepted) {
        // Set the form control value to true and mark as dirty/touched
        const consentControl = this.applicationForm.get('consent');
        consentControl?.setValue(true);
        consentControl?.markAsDirty();
        consentControl?.markAsTouched();
      }
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
