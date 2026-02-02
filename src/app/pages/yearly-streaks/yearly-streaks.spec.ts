import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyStreaks } from './yearly-streaks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HabitLogService, HabitLogsPerYear } from '../../shared/services/habit-log-service';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

describe('YearlyStreaks', () => {
  let component: YearlyStreaks;
  let fixture: ComponentFixture<YearlyStreaks>;
  let habitLogService: HabitLogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyStreaks, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(YearlyStreaks);
    component = fixture.componentInstance;
    habitLogService = TestBed.inject(HabitLogService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read habit logs from the server', async () => {
    const habitLogs = {
      1: {
        1: {
          habit_name: 'Reading',
          logs_count: 3,
          habit_frequency: 3,
          habit_color: '#ff0000',
        },
        2: {
          habit_name: 'Writing',
          logs_count: 2,
          habit_frequency: 2,
          habit_color: '#00ff00',
        },
      },
      2: {
        1: {
          habit_name: 'Reading',
          logs_count: 2,
          habit_frequency: 2,
          habit_color: '#ff0000',
        },
        2: {
          habit_name: 'Writing',
          logs_count: 1,
          habit_frequency: 1,
          habit_color: '#00ff00',
        },
      },
    };
    vi.spyOn(habitLogService, 'get').mockReturnValue(
      of(new HttpResponse<HabitLogsPerYear>({ status: 200, body: habitLogs })),
    );
    await component.getHabitLogsByYear();
    expect(component.habitLogsByYear()).toEqual(habitLogs);
  });

  it('should download yearly streaks', async () => {
    vi.spyOn(habitLogService, 'downloadYearlyStreaks').mockReturnValue(
      of(new HttpResponse<Blob>({ status: 200, body: new Blob() })),
    );
    component.currentYear.set(2023);
    await component.downloadYearlyStreaks();
    expect(habitLogService.downloadYearlyStreaks).toHaveBeenCalledWith({
      year: 2023,
    });
  });
});
