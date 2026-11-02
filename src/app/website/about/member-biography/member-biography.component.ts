import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HttpService } from '@src/app/services/http.service';
import { OrganizationMember } from '../organization/organization.models';
import { env } from '@src/environment';
import { MarkdownPipe } from '@src/app/shared/pipes/markdown.pipe';

@Component({
  selector: 'app-member-biography',
  imports: [TranslateModule, MarkdownPipe],
  templateUrl: './member-biography.component.html',
  styleUrl: './member-biography.component.scss',
  standalone: true,
})
export class MemberBiographyComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly role: string = this.route.snapshot.data['role'];
  public readonly titleKey: string = this.route.snapshot.data['titleKey'] ?? '';

  public readonly member = signal<OrganizationMember | null>(null);
  public readonly loaded = signal(false);

  protected readonly env = env;

  ngOnInit(): void {
    this.loadMember();

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadMember();
    });
  }

  private loadMember(): void {
    const locale = this.translate.getCurrentLang() || 'en';

    this.httpService
      .getOrganizationMember(this.role, locale)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (member) => {
          this.member.set(member);
          this.loaded.set(true);
        },
        error: (error: unknown) => {
          console.error('Failed to load organization member:', error);
          this.member.set(null);
          this.loaded.set(true);
        },
      });
  }
}
