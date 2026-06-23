import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UtilsService } from '@src/app/services/utils.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [TranslateModule]
})
export class NotFoundComponent {

  constructor(public utils: UtilsService) { }

}
