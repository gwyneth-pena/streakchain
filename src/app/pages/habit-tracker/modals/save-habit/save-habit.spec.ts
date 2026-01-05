import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveHabit } from './save-habit';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('SaveHabit', () => {
  let component: SaveHabit;
  let fixture: ComponentFixture<SaveHabit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveHabit],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close: vi.fn(),
            dismiss: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SaveHabit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
