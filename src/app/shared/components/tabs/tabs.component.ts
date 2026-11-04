import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface TabOption<T extends string = string> {
  key: T;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div
      class="tabs"
      [class.soft]="appearance === 'soft'"
      [attr.aria-label]="ariaLabel"
      role="group"
    >
      @for (tab of tabs; track tab.key) {
        <button
          type="button"
          [class.active]="activeTab === tab.key"
          [attr.aria-pressed]="activeTab === tab.key"
          (click)="activeTabChange.emit(tab.key)"
        >
          {{ tab.label | translate }}
          @if (tab.count !== undefined) {
            ({{ tab.count }})
          }
        </button>
      }
    </div>
  `,
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent<T extends string = string> {
  @Input({ required: true }) tabs: readonly TabOption<T>[] = [];
  @Input({ required: true }) activeTab!: T;
  @Input() appearance: 'default' | 'soft' = 'default';
  @Input() ariaLabel = '';

  @Output() readonly activeTabChange = new EventEmitter<T>();
}
