import { DatePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { env } from '@src/environment';
import { HttpService } from '@src/app/services/http.service';
import { TabOption, TabsComponent } from '@src/app/shared/components/tabs/tabs.component';
import { DocumentCategory } from './documents.models';

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  laws: 'DOCS_CAT_LAWS',
  statute: 'DOCS_CAT_STATUTE',
  finance: 'DOCS_CAT_FINANCE',
  program: 'DOCS_CAT_PROGRAM',
  forms: 'DOCS_CAT_FORMS',
  other: 'DOCS_CAT_OTHER',
};

const CATEGORY_ICONS: Record<DocumentCategory, string> = {
  laws: 'gavel',
  statute: 'balance',
  finance: 'account_balance_wallet',
  program: 'flag',
  forms: 'assignment',
  other: 'description',
};

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [DatePipe, UpperCasePipe, FormsModule, MatIconModule, TranslateModule, TabsComponent],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent {
  private readonly translate = inject(TranslateService);
  private readonly http = inject(HttpService);

  private readonly lang$ = this.translate.onLangChange.pipe(
    map((e) => e.lang),
    startWith(this.translate.currentLang || this.translate.defaultLang || 'en'),
  );

  readonly loading = signal(true);
  readonly error = signal(false);

  private readonly documents = toSignal(
    this.lang$.pipe(
      tap(() => {
        this.loading.set(true);
        this.error.set(false);
      }),
      switchMap((lang) =>
        this.http.getDocuments(lang).pipe(
          catchError(() => {
            this.error.set(true);
            return of([]);
          }),
        ),
      ),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: [] },
  );

  readonly labels = CATEGORY_LABELS;
  readonly icons = CATEGORY_ICONS;
  readonly categories = computed(() =>
    (Object.keys(CATEGORY_LABELS) as DocumentCategory[]).map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      count: this.documents().filter((d) => d.category === key).length,
    })),
  );
  readonly total = computed(() => this.documents().length);
  readonly tabs = computed<TabOption<DocumentCategory | 'all'>[]>(() => [
    { key: 'all', label: 'DOCS_ALL', count: this.total() },
    ...this.categories(),
  ]);
  readonly years = computed(() =>
    [...new Set(this.documents().map((d) => new Date(d.lastUpdated).getFullYear()))].sort(
      (a, b) => b - a,
    ),
  );

  readonly category = signal<DocumentCategory | 'all'>('all');
  readonly year = signal<string>('all');
  readonly sort = signal<'newest' | 'oldest' | 'name'>('newest');
  readonly query = signal('');

  readonly items = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.documents().filter(
      (d) =>
        (this.category() === 'all' || d.category === this.category()) &&
        (this.year() === 'all' || String(new Date(d.lastUpdated).getFullYear()) === this.year()) &&
        (!q || d.title.toLowerCase().includes(q)),
    );
    const sort = this.sort();
    return [...list].sort((a, b) =>
      sort === 'name'
        ? a.title.localeCompare(b.title)
        : sort === 'oldest'
          ? Date.parse(a.lastUpdated) - Date.parse(b.lastUpdated)
          : Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated),
    );
  });

  async download(d: { path: string; title: string; format: string }): Promise<void> {
    const url = this.fileUrl(d.path);
    const ext = d.format ? `.${d.format.toLowerCase()}` : '';
    const name = /\.[a-z0-9]+$/i.test(d.title) ? d.title : `${d.title}${ext}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const blobUrl = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = name;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank', 'noopener');
    }
  }

  fileUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${env.backendUrl}/${path.replace(/^\/+/, '')}`;
  }
}
