import { Component } from '@angular/core';
import { TextPageComponent } from '@src/app/shared/components/text-page/text-page.component';

@Component({
  selector: 'app-sdl',
  standalone: true,
  imports: [TextPageComponent],
  template: `<app-text-page greetingKey="ABOUT_SDL_GREETING" [paragraphKeys]="paragraphKeys" />`,
})
export class SdlComponent {
  protected readonly paragraphKeys = ['ABOUT_SDL_TEXT'];
}
