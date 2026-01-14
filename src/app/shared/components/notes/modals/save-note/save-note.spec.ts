import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveNote } from './save-note';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('SaveNote', () => {
  let component: SaveNote;
  let fixture: ComponentFixture<SaveNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveNote],
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

    fixture = TestBed.createComponent(SaveNote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
