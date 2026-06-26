import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { provideTranslateService } from '@ngx-translate/core';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([]), CookieService, provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });
});
