import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Statistics } from './statistics';
import { Habit, HabitService } from '../../shared/services/habit-service';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HabitStatistics, StatisticsService } from '../../shared/services/statistics-service';

describe('Statistics', () => {
  let component: Statistics;
  let fixture: ComponentFixture<Statistics>;
  let habitsService: HabitService;
  let statisticsService: StatisticsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Statistics, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Statistics);
    habitsService = TestBed.inject(HabitService);
    statisticsService = TestBed.inject(StatisticsService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoud show habits', async () => {
    const habits = [
      {
        id: 1,
        name: 'Reading',
        color: '#ff0000',
        frequency: 3,
        last_used: new Date(),
      },
      {
        id: 2,
        name: 'Writing',
        color: '#00ff00',
        frequency: 2,
        last_used: new Date(),
      },
    ];
    vi.spyOn(habitsService, 'get').mockReturnValue(
      of(new HttpResponse<Habit[]>({ status: 200, body: habits })),
    );

    await component.ngOnInit();
    expect(component.habits()).toEqual(habits);
  });

  it('should show statistics', async () => {
    const statistics = {
      habit_with_max_streak: {
        habit_with_max_streak: 'Reading',
        max_streak: 3,
      },
      total_logs: 10,
      completion_rates: {
        percentages_per_habit: {
          Reading: 0.3,
          Writing: 0.7,
        },
        total_percentage: 0.9,
      },
    };
    vi.spyOn(statisticsService, 'get').mockReturnValue(
      of(new HttpResponse<HabitStatistics>({ status: 200, body: statistics })),
    );
    await component.ngOnInit();

    expect(component.statistics()).toEqual(statistics);
  });
});
