import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Simple centered page with the party logo and translated text content.
 * All inputs are translation keys.
 */
@Component({
  selector: 'app-text-page',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './text-page.component.html',
  styleUrl: './text-page.component.scss',
})
export class TextPageComponent {
  public readonly titleKey = input<string>();
  public readonly greetingKey = input<string>();
  public readonly listKeys = input<string[]>([]);
  public readonly paragraphKeys = input<string[]>([]);
}
