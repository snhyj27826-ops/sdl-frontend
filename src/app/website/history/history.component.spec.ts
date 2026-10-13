import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { HistoryService } from './history.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HistoryDialogComponent } from './history-dialog/history-dialog.component';
import { By } from '@angular/platform-browser';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let historyService: jasmine.SpyObj<HistoryService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const historySpy = jasmine.createSpyObj('HistoryService', ['getTimeline']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HistoryComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: HistoryService, useValue: historySpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    }).compileComponents();

    historyService = TestBed.inject(HistoryService) as jasmine.SpyObj<HistoryService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    historyService.getTimeline.and.returnValue(of({ data: [], hasMore: false }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load timeline entries', () => {
    const mockData = [
      {
        year: 1990,
        title: 'Test',
        description: 'Test description',
        image: 'image.jpg',
        category: 'Test',
      },
    ];
    historyService.getTimeline.and.returnValue(of({ data: mockData, hasMore: false }));
    fixture.detectChanges();

    expect(component.timelineEntries.length).toBe(1);
    expect(component.loading).toBe(false);
  });

  it('should assign fallback image if not provided', () => {
    const mockData = [
      {
        year: 1990,
        title: 'Test',
        description: 'Test description',
        category: 'Test',
      },
    ];
    historyService.getTimeline.and.returnValue(of({ data: mockData, hasMore: false }));
    fixture.detectChanges();

    expect(component.timelineEntries.length).toBe(1);
    expect(component.timelineEntries[0].image).toBe('uploads/timeline/maricka-bitka.jpg');
  });

  it('should open history dialog when openDetailDialog is called', () => {
    const entry = {
      year: 1908,
      title: 'Historical Event',
      description: 'Full text of the event description.',
      image: 'uploads/event.jpg',
      category: 'Politics',
    };

    component.openDetailDialog(entry);

    expect(dialogSpy.open).toHaveBeenCalledWith(HistoryDialogComponent, {
      data: entry,
      width: '640px',
      maxWidth: '92vw',
      maxHeight: '90vh',
      autoFocus: false,
    });
  });

  it('should trigger openDetailDialog when Read more button is clicked', () => {
    const mockData = [
      {
        year: 1908,
        title: 'Historical Event',
        description: 'Full text description',
        image: 'uploads/event.jpg',
        category: 'Politics',
      },
    ];
    historyService.getTimeline.and.returnValue(of({ data: mockData, hasMore: false }));
    fixture.detectChanges();

    spyOn(component, 'openDetailDialog');
    const readMoreBtn = fixture.debugElement.query(By.css('.read-more-btn'));
    expect(readMoreBtn).toBeTruthy();

    readMoreBtn.nativeElement.click();
    expect(component.openDetailDialog).toHaveBeenCalledWith(component.timelineEntries[0]);
  });

  describe('truncateDescription', () => {
    it('should return empty string if input is null or undefined or empty', () => {
      expect(component.truncateDescription(undefined)).toBe('');
      expect(component.truncateDescription('')).toBe('');
    });

    it('should return original text if length is <= limit', () => {
      const shortText = 'Short description';
      expect(component.truncateDescription(shortText, 500)).toBe(shortText);

      const exact500 = 'a'.repeat(500);
      expect(component.truncateDescription(exact500, 500)).toBe(exact500);
    });

    it('should truncate text to 500 characters and append ellipsis if length > 500', () => {
      const longText = 'a'.repeat(600);
      const result = component.truncateDescription(longText, 500);
      expect(result).toBe('a'.repeat(500) + '...');
      expect(result.length).toBe(503);
    });

    it('should display truncated description in DOM when description exceeds 500 characters', () => {
      const longDescription = 'A'.repeat(550);
      const mockData = [
        {
          year: 1908,
          title: 'Historical Event',
          description: longDescription,
          image: 'uploads/event.jpg',
          category: 'Politics',
        },
      ];
      historyService.getTimeline.and.returnValue(of({ data: mockData, hasMore: false }));
      fixture.detectChanges();

      const descElement = fixture.debugElement.query(By.css('.entry-description'));
      expect(descElement.nativeElement.textContent).toBe('A'.repeat(500) + '...');
    });
  });
});
