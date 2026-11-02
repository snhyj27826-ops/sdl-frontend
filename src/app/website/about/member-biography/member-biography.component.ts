import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HttpService } from '@src/app/services/http.service';
import { OrganizationMember } from '../organization/organization.models';
import { env } from '@src/environment';

@Component({
  selector: 'app-member-biography',
  imports: [TranslateModule],
  templateUrl: './member-biography.component.html',
  styleUrl: './member-biography.component.scss',
  standalone: true,
})
export class MemberBiographyComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // Position of the member in the sorted organization list (route data `memberIndex`)
  private readonly memberIndex: number = this.route.snapshot.data['memberIndex'] ?? 0;
  public readonly titleKey: string = this.route.snapshot.data['titleKey'] ?? '';

  public readonly members = signal<OrganizationMember[]>([]);
  public readonly loaded = signal(false);
  public readonly member = computed(() => this.members()[this.memberIndex] ?? null);

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
      .getOrganization(locale)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (members) => {
          this.members.set(members);
          this.loaded.set(true);
        },
        error: (error: unknown) => {
          console.error('Failed to load organization data:', error);
          this.loaded.set(true);
        },
      });
  }
}
