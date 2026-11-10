import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { env } from '@src/environment';
import { OrganizationMember } from '../organization/organization.models';

@Component({
  selector: 'app-members-grid',
  templateUrl: './members-grid.component.html',
  styleUrl: './members-grid.component.scss',
  imports: [RouterLink, TranslateModule],
  standalone: true,
})
export class MembersGridComponent {
  public readonly members = input.required<OrganizationMember[]>();
  public readonly emptyMessage = input('MEMBERS_EMPTY');
  public readonly showBiography = input(true);

  protected readonly env = env;

  protected onImageError(event: Event): void {
    const image = event.target;
    const fallbackUrl = `${env.backendUrl}/uploads/members/placeholder-image.jpg`;

    if (image instanceof HTMLImageElement && image.src !== fallbackUrl) {
      image.src = fallbackUrl;
    }
  }
}
