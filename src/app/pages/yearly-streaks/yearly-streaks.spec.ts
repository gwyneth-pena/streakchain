import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyStreaks } from './yearly-streaks';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('YearlyStreaks', () => {
  let component: YearlyStreaks;
  let fixture: ComponentFixture<YearlyStreaks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyStreaks, HttpClientTestingModule],
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
