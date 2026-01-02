import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveHabit } from './save-habit';

describe('SaveHabit', () => {
  let component: SaveHabit;
  let fixture: ComponentFixture<SaveHabit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveHabit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveHabit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
