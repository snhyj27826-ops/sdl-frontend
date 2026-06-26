import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

export interface TeamMember {
  nameKey: string;
  roleKey: string;
  imageUrl: string;
}

@Component({
  selector: 'app-organization',
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss',
  standalone: true,
})
export class OrganizationComponent {
  public teamMembers: TeamMember[] = [
    {
      nameKey: 'NAME_MILENA_POPOVIC',
      roleKey: 'ROLE_VICE_PRESIDENT',
      imageUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800',
    },
    {
      nameKey: 'NAME_DRAGAN_STOSIC',
      roleKey: 'ROLE_GENERAL_SECRETARY',
      imageUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=800',
    },
    {
      nameKey: 'NAME_JELENA_SAVIC',
      roleKey: 'ROLE_MEDIA_COORDINATOR',
      imageUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800',
    },
    {
      nameKey: 'NAME_NIKOLA_TESIC',
      roleKey: 'ROLE_ECONOMIC_ADVISOR',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600&h=800',
    },
    {
      nameKey: 'NAME_ANA_LUKIC',
      roleKey: 'ROLE_ORGANIZATIONAL_SECRETARY',
      imageUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=800',
    },
    {
      nameKey: 'NAME_SLOBODAN_ILIC',
      roleKey: 'ROLE_EXECUTIVE_BOARD_PRESIDENT',
      imageUrl:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=600&h=800',
    },
    {
      nameKey: 'NAME_MARIJA_PETRIC',
      roleKey: 'ROLE_LEGAL_ADVISOR',
      imageUrl:
        'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600&h=800',
    },
    {
      nameKey: 'NAME_STEFAN_VUCIC',
      roleKey: 'ROLE_YOUTH_NETWORK',
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    },
    {
      nameKey: 'NAME_PAVLE_KOSTIC',
      roleKey: 'ROLE_REGIONAL_COORDINATOR',
      imageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=800',
    },
  ];
}
