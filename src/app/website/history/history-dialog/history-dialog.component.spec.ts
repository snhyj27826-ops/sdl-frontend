import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { HistoryDialogComponent } from './history-dialog.component';
import { TimelineEntry } from '../history.models';

describe('HistoryDialogComponent', () => {
  let component: HistoryDialogComponent;
  let fixture: ComponentFixture<HistoryDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<HistoryDialogComponent>>;

  const mockEntry: TimelineEntry = {
    _id: '123',
    year: 1908,
    title: 'Founding Conference',
    description: 'Detailed and full text description of the historical founding event.',
    image: 'uploads/timeline/conference.jpg',
    category: 'Conference',
    sortOrder: 1,
    isPublished: true,
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [HistoryDialogComponent, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockEntry },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render event title, year, description, and image', () => {
    const titleEl = fixture.debugElement.query(By.css('.dialog-title'));
    expect(titleEl.nativeElement.textContent).toContain('Founding Conference');

    const yearEl = fixture.debugElement.query(By.css('.year-badge'));
    expect(yearEl.nativeElement.textContent).toContain('1908.');

    const descEl = fixture.debugElement.query(By.css('.dialog-description'));
    expect(descEl.nativeElement.textContent).toContain(
      'Detailed and full text description of the historical founding event.',
    );

    const imgEl = fixture.debugElement.query(By.css('.dialog-image'));
    expect(imgEl).toBeTruthy();
    expect(imgEl.nativeElement.getAttribute('src')).toBe('uploads/timeline/conference.jpg');
    expect(imgEl.nativeElement.getAttribute('alt')).toBe('Founding Conference');

    const catEl = fixture.debugElement.query(By.css('.category-badge'));
    expect(catEl.nativeElement.textContent).toContain('Conference');
  });
});
