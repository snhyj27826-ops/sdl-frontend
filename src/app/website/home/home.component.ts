import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSliderComponent } from '@src/app/shared/components/hero-slider/hero-slider.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [TranslateModule, HeroSliderComponent],
})
export class HomeComponent {
  constructor() {}
}
