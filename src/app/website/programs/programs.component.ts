import { DatePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { TabsComponent } from '@src/app/shared/components/tabs/tabs.component';
import {
  DocumentTitle,
  DocumentsComponent,
} from '@src/app/website/documents/documents.component';
import { DocumentCategory, PublicDocument } from '@src/app/website/documents/documents.models';

// File names look like "programa-sdl-2026.pdf" (the year is the only varying part).
const PROGRAM_FILE_NAME = /(?:^|\/)programa-sdl-(\d{4})(?:\.[a-z0-9]+)?$/i;

function programYear(d: PublicDocument): number | null {
  const match = PROGRAM_FILE_NAME.exec(d.path.split(/[?#]/)[0]);
  return match ? Number(match[1]) : null;
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    DatePipe,
    UpperCasePipe,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    TranslateModule,
    TabsComponent,
  ],
  templateUrl: '../documents/documents.component.html',
  styleUrls: ['../documents/documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsComponent extends DocumentsComponent {
  override readonly simple = true;
  override readonly text = {
    badge: 'DOCS_BADGE',
    title: 'PROGRAMS_TITLE',
    subtitle: 'PROGRAMS_SUBTITLE',
    empty: 'PROGRAMS_EMPTY',
  };
  override readonly category = signal<DocumentCategory | 'all'>('program');

  protected override yearOf(d: PublicDocument): number {
    return programYear(d) ?? super.yearOf(d);
  }

  protected override timeOf(d: PublicDocument): number {
    const year = programYear(d);
    return year === null ? super.timeOf(d) : Date.UTC(year, 0, 1);
  }

  override titleOf(d: PublicDocument): DocumentTitle {
    const year = programYear(d);
    return year === null
      ? super.titleOf(d)
      : { text: d.title, key: 'PROGRAMS_ITEM_TITLE', params: { year } };
  }
}
