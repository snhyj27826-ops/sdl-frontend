import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { TimelineEntry } from '../history.models';

@Component({
  selector: 'app-history-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  templateUrl: './history-dialog.component.html',
  styleUrl: './history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimelineEntry,
  ) {}
}
