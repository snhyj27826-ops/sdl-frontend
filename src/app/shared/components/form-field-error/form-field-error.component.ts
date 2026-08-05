import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-field-error',
  standalone: true,
  imports: [TranslateModule],
  template: `
    @if (control && control.errors) {
      @if (control.hasError('required')) {
        <span>{{ 'ERRORS.REQUIRED' | translate }}</span>
      }

      @if (control.hasError('email')) {
        <span>{{ 'ERRORS.EMAIL' | translate }}</span>
      }

      @if (control.getError('minlength'); as err) {
        <span>{{ 'ERRORS.MINLENGTH' | translate: err }}</span>
      }
    }
  `,
})
export class FieldErrorComponent {
  @Input({ required: true }) control!: AbstractControl | null;
}
