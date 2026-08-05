import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface GenericDialogData {
  title: string;
  /** Plain text string or HTML content */
  content: string;
  /** Set to true if `content` contains HTML markup */
  isHtml?: boolean;
  /** Label for primary button (Defaults to 'OK') */
  confirmText?: string;
  /** Label for secondary button. If omitted, no cancel button renders (Alert mode) */
  cancelText?: string;
  /** Primary button theme color */
  confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <mat-dialog-content>
      @if (data.isHtml) {
        <div [innerHTML]="data.content"></div>
      } @else {
        <p style="white-space: pre-wrap;">{{ data.content }}</p>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      @if (data.cancelText) {
        <button mat-button [mat-dialog-close]="false">
          {{ data.cancelText }}
        </button>
      }
      <button mat-raised-button [color]="data.confirmColor || 'primary'" [mat-dialog-close]="true">
        {{ data.confirmText || 'OK' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        max-height: 65vh; /* Enables scrolling for long content like Terms & Conditions */
      }
    `,
  ],
})
export class GenericDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogData,
  ) {}
}
