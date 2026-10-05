import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type SupportedLanguage = 'en' | 'sr' | 'mk';

function isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
  return language === 'en' || language === 'sr' || language === 'mk';
}

@Component({
  selector: 'app-under-construction',
  standalone: true,
  templateUrl: './under-construction.component.html',
  styleUrl: './under-construction.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslateModule],
})
export class UnderConstructionComponent implements OnInit {
  public currentLanguage: SupportedLanguage = 'en';
  public readonly languages: readonly SupportedLanguage[] = ['en', 'sr', 'mk'];

  constructor(private readonly translate: TranslateService) {}

  public ngOnInit(): void {
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = this.translate.getBrowserLang();
    const language = isSupportedLanguage(savedLanguage)
      ? savedLanguage
      : isSupportedLanguage(browserLanguage)
        ? browserLanguage
        : 'en';

    this.setLanguage(language);
  }

  public setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    this.translate.use(language);
    localStorage.setItem('language', language);
  }
}
