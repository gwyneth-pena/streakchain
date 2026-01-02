import { TestBed } from '@angular/core/testing';

import { HabitLogService } from './habit-log-service';

describe('HabitLogService', () => {
  let service: HabitLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
