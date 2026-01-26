import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyStreaks } from './yearly-streaks';

describe('YearlyStreaks', () => {
  let component: YearlyStreaks;
  let fixture: ComponentFixture<YearlyStreaks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyStreaks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyStreaks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
