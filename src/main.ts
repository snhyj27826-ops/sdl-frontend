import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { register } from 'swiper/element/bundle';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { LocalizedTitleStrategy } from './app/localized-title.strategy';

register();

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(),
    { provide: TitleStrategy, useClass: LocalizedTitleStrategy },

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
});
