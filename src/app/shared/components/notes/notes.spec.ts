import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notes } from './notes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotesService } from '../../services/notes-service';
import { of } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';

describe('Notes', () => {
  let component: Notes;
  let fixture: ComponentFixture<Notes>;
  let notesService: NotesService;
  let toastMockService: Partial<HotToastService>;
  
  toastMockService = {
    success: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notes, HttpClientTestingModule],
      providers: [
        {
          provide: HotToastService,
          useValue: toastMockService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Notes);
    notesService = TestBed.inject(NotesService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all notes', async () => {
    const notes = [
      {
        id: 1,
        title: 'Note 1',
        content: 'Note 1 content',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Note 2',
        content: 'Note 2 content',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.spyOn(notesService, 'get').mockReturnValue(
      of({
        status: 200,
        body: notes,
      })
    );

    fixture.componentRef.setInput('month', 1);
    fixture.componentRef.setInput('year', 2022);
    fixture.componentRef.setInput('numberOfDays', 30);

    expect(component.notes()).toEqual(null);

    component.notes.set([]);

    expect(component.notes()).toEqual([]);
    expect(component.month()).toEqual(1);
    expect(component.year()).toEqual(2022);
    expect(component.numberOfDays()).toEqual(30);

    await component.getNotes();

    expect(component.notes()).toEqual(notes);
  });

  it('should save a note', async () => {
    const note = {
      title: 'Note 1',
      content: 'Note 1 content',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(notesService, 'save').mockReturnValue(
      of({
        status: 200,
        body: note,
      })
    );

    component.saveNote(note);

    await Promise.resolve();

    fixture.detectChanges();
    
    expect(component.notes()).toEqual([note]);
    expect(toastMockService.success).toHaveBeenCalledWith('Note saved successfully!');
  });

  it('should delete a note', async () => {
    const note = {
      id: 1,
      title: 'Note 1',
      content: 'Note 1 content',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    component.notes.set([note]);
    component.openDeleteNoteModal = vi.fn().mockReturnValue(Promise.resolve(true));
    vi.spyOn(notesService, 'delete').mockReturnValue(of({ status: 200, body: {} }));
    await component.deleteNote(note);
    expect(component.notes()).toEqual([]);
  });

  it('should edit a note', async () => {
    const note = {
      id: 1,
      title: 'Note 1',
      content: 'Note 1 content',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    component.notes.set([note]);
    component.openSaveNoteModal = vi.fn().mockReturnValue(Promise.resolve(true));
    vi.spyOn(notesService, 'patch').mockReturnValue(of({ status: 200, body: {} }));
    await component.saveNote(note);
    expect(component.notes()).toEqual([note]);
  });
});
