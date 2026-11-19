import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { env } from '@src/environment';
import { HttpService } from '@src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class StatuteService {
  constructor(
    private readonly http: HttpService,
    private readonly translate: TranslateService,
  ) {}

  // The tab is opened synchronously so popup blockers allow it; the URL is set once resolved.
  async openInNewTab(): Promise<void> {
    const tab = window.open('', '_blank');
    if (tab) tab.opener = null;

    try {
      const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
      const documents = await firstValueFrom(this.http.getDocuments(lang));
      const candidates = documents
        .filter((d) => d.category === 'statute')
        .sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated));
      // The statute file is named "statut-sdl"; guards against other documents filed under this category.
      const statute = candidates.find((d) => /(^|\/)statut/i.test(d.path)) ?? candidates[0];
      if (!statute) throw new Error('Statute document not found');

      const url = /^https?:\/\//i.test(statute.path)
        ? statute.path
        : `${env.backendUrl}/${statute.path.replace(/^\/+/, '')}`;
      if (tab) tab.location.href = url;
      else window.open(url, '_blank', 'noopener');
    } catch {
      tab?.close();
    }
  }
}
