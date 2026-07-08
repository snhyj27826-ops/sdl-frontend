import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { HistoryService } from './history.service';
import { of } from 'rxjs';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let historyService: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HistoryService', ['getTimeline']);

    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [{ provide: HistoryService, useValue: spy }],
    }).compileComponents();

    historyService = TestBed.inject(HistoryService) as jasmine.SpyObj<HistoryService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    historyService.getTimeline.and.returnValue(of([]));
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
    historyService.getTimeline.and.returnValue(of({ data: mockData }));
    fixture.detectChanges();

    expect(component.timelineEntries.length).toBe(1);
    expect(component.loading).toBe(false);
  });
});
