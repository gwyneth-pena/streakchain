import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveNote } from './save-note';

describe('SaveNote', () => {
  let component: SaveNote;
  let fixture: ComponentFixture<SaveNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveNote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveNote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
