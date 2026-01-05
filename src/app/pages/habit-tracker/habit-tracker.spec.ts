import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitTracker } from './habit-tracker';
import { HotToastService } from '@ngxpert/hot-toast';
import { HabitService } from '../../shared/services/habit-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HabitLogService } from '../../shared/services/habit-log-service';

describe('HabitTracker', () => {
  let component: HabitTracker;
  let fixture: ComponentFixture<HabitTracker>;
  let toastMockService: Partial<HotToastService>;
  let habitService: HabitService;
  let habitLogService: HabitLogService;

  beforeEach(async () => {
    toastMockService = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HabitTracker, HttpClientTestingModule],
      providers: [
        {
          provide: HotToastService,
          useValue: toastMockService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitTracker);
    component = fixture.componentInstance;

    habitService = TestBed.inject(HabitService);
    habitLogService = TestBed.inject(HabitLogService);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read habits from the server', async () => {
    const habits = [
      {
        id: 1,
        name: 'Reading',
        frequency: 3,
        color: '#ff0000',
        logs: [
          {
            id: 1,
            log_date: '2023-01-01',
          },
          {
            id: 2,
            log_date: '2023-01-02',
          },
        ],
      },
    ];
    vi.spyOn(habitService, 'get').mockReturnValue(of({ status: 200, body: habits }));
    await component.getHabits();
    expect(component.habits()).toEqual(habits);
  });

  it('should save a habit', async () => {
    const habit = {
      name: 'Reading',
      frequency: 3,
      color: '#ff0000',
      logs: [],
    };

    vi.spyOn(habitService, 'save').mockReturnValue(of({ status: 200, body: habit }));
    await component.saveHabit(habit);
    expect(component.habits()).toEqual([habit]);
    expect(toastMockService.success).toHaveBeenCalledWith('Habit saved successfully!');
  });

  it('should delete a habit', async () => {
    const habit = {
      id: 1,
      name: 'Reading',
      frequency: 3,
      color: '#ff0000',
      logs: [],
    };
    component.habits.set([habit]);
    vi.spyOn(component, 'openDeleteHabitModal').mockReturnValue(Promise.resolve(true));
    vi.spyOn(habitService, 'delete').mockReturnValue(of({ status: 200, body: habit }));
    await component.deleteHabit(habit);
    expect(component.habits()).toEqual([]);
  });

  it('should save habit log when clicking on a habit tracker cell', async () => {
    const habit = {
      id: 1,
      name: 'Reading',
      frequency: 3,
      color: '#ff0000',
      logs: [],
    };
    component.habits.set([habit]);
    fixture.detectChanges();
    const habitTrackerCell = fixture.debugElement.query(
      By.css('[data-testid="habit-tracker-cell"]')
    );
    habitTrackerCell.nativeElement.click();
    fixture.detectChanges();

    vi.spyOn(habitLogService, 'save').mockReturnValue(
      of({
        status: 200,
        body: {
          id: 1,
          log_date: '2023-01-01',
        },
      })
    );
    fixture.detectChanges();
    habitTrackerCell.nativeElement.click();
    await Promise.resolve();
    fixture.detectChanges();
    expect(component.habits()[0].logs.length).toEqual(1);
  });

  it('should delete habit log when clicking on a habit tracker cell', async () => {
    const habit = {
      id: 1,
      name: 'Reading',
      frequency: 3,
      color: '#ff0000',
      logs: [
        {
          id: 1,
          log_date: '2023-01-01',
          habit_id: 1,
        },
      ],
    };
    component.habits.set([habit]);
    component.currentMonthYear = {
      month: 'January',
      year: 2023,
      date: new Date('2023-01-01'),
      monthNumber: 1,
      numberOfDays: new Date(2023, 0, 0).getDate(),
    };
    component.getCalendarDays();

    fixture.detectChanges();

    const habitTrackerCell = fixture.debugElement.query(
      By.css('[data-testid="habit-tracker-cell"]')
    );

    expect(component.habits()[0].logs.length).toEqual(1);
    expect(component.hasHabitLog(habit, '1')).toEqual(true);

    vi.spyOn(habitLogService, 'delete').mockReturnValue(of({ status: 200, body: {} }));
    
    habitTrackerCell.nativeElement.click();
    fixture.detectChanges();

    await Promise.resolve();
    fixture.detectChanges();

    expect(habitLogService.delete).toHaveBeenCalledWith(habit.logs[0].id);
    expect(component.habits()[0].logs.length).toEqual(0);

  });
});
