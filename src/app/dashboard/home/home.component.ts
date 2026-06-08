import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HomeComponent {

  constructor(public utils: UtilsService) { }

  ngOnInit(): void {

  }
}
