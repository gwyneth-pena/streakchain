import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notes } from './notes';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Notes', () => {
  let component: Notes;
  let fixture: ComponentFixture<Notes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notes, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Notes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
