import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HttpService } from '@src/app/services/http.service';
import { OrganizationMember } from './organization.models';

@Component({
  selector: 'app-organization',
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss',
  standalone: true,
})
export class OrganizationComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly teamMembers = signal<OrganizationMember[]>([]);
  public readonly presidentMember = computed(() => this.teamMembers()[0] ?? null);
  public readonly remainingTeamMembers = computed(() => this.teamMembers().slice(1));

  ngOnInit(): void {
    this.loadOrganizationData();

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadOrganizationData();
    });
  }

  private loadOrganizationData(): void {
    const locale = this.translate.getCurrentLang() || 'en';

    this.httpService
      .getOrganization(locale)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (members) => {
          console.log('Received members:', members);

          this.teamMembers.set(members);
        },
        error: (error: unknown) => {
          console.error('Failed to load organization data:', error);
        },
      });
  }
}
