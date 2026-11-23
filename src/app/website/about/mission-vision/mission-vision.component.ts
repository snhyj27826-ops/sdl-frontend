import { Component } from '@angular/core';
import { TextPageComponent } from '@src/app/shared/components/text-page/text-page.component';

@Component({
  selector: 'app-mission-vision',
  standalone: true,
  imports: [TextPageComponent],
  template: `
    <app-text-page
      titleKey="MISSION_VISION_TITLE"
      [listKeys]="listKeys"
      [paragraphKeys]="paragraphKeys"
    />
  `,
})
export class MissionVisionComponent {
  protected readonly listKeys = ['MISSION_VISION_ITEM_1', 'MISSION_VISION_ITEM_2'];
  protected readonly paragraphKeys = [1, 2, 3, 4, 5].map((n) => `MISSION_VISION_P${n}`);
}
