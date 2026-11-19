import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { HttpService } from '@src/app/services/http.service';

export interface PartyRulesDialogData {
  firstName?: string;
  fathersName?: string;
  lastName?: string;
  handwrittenSignature?: { type: 'image' | 'drawn'; dataUrl: string } | null;
}

@Component({
  selector: 'app-party-rules-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinner, TranslatePipe],
  templateUrl: './party-rules-dialog.component.html',
  styleUrls: ['./party-rules-dialog.component.scss'],
})
export class PartyRulesDialogComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly data = inject<PartyRulesDialogData>(MAT_DIALOG_DATA);

  public readonly isLoading = signal(true);
  public readonly hasError = signal(false);
  public readonly pdfUrl = signal<SafeResourceUrl | null>(null);
  public readonly rawPdfUrl = signal<string | null>(null);

  ngOnInit(): void {
    this.http
      .previewPartyRules({
        firstName: this.data.firstName,
        fathersName: this.data.fathersName,
        lastName: this.data.lastName,
        handwrittenSignature: this.data.handwrittenSignature ?? undefined,
      })
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
          this.rawPdfUrl.set(url);
          this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Party rules preview failed', error);
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    const url = this.rawPdfUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}
