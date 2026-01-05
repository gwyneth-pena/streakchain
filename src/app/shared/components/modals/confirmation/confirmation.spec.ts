import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmation } from './confirmation';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('Confirmation', () => {
  let component: Confirmation;
  let fixture: ComponentFixture<Confirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmation],
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

    fixture = TestBed.createComponent(Confirmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
