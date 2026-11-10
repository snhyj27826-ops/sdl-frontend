import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HttpService } from '@src/app/services/http.service';
import { OrganizationMember } from '../organization/organization.models';
import { MembersGridComponent } from '../members-grid/members-grid.component';

@Component({
  selector: 'app-central-committee',
  imports: [CommonModule, TranslateModule, RouterLink, MembersGridComponent],
  templateUrl: './central-committee.component.html',
  styleUrl: './central-committee.component.scss',
  standalone: true,
})
export class CentralCommitteeComponent implements OnInit {
  private readonly httpService = inject(HttpService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly teamMembers = signal<OrganizationMember[]>([]);

  ngOnInit(): void {
    this.loadOrganizationData();

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadOrganizationData();
    });
  }

  private loadOrganizationData(): void {
    const locale = this.translate.getCurrentLang() || 'en';

    this.httpService
      .getOrganization(locale, 'central-committee')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (members) => {
          this.teamMembers.set(members);
        },
        error: (error: unknown) => {
          console.error('Failed to load organization data:', error);
        },
      });
  }
}
