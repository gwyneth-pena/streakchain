import { Component, effect, input, signal } from '@angular/core';
import { NotesService } from '../../services/notes-service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotToastService } from '@ngxpert/hot-toast';
import { SaveNote } from './modals/save-note/save-note';
import { NgxSpinnerService } from 'ngx-spinner';
import { Confirmation } from '../modals/confirmation/confirmation';

@Component({
  selector: 'app-notes',
  imports: [CommonModule],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class Notes {
  month = input<number>(1);
  year = input<number>(1990);
  numberOfDays = input<number>(30);

  notes = signal<any | null>(null);

  constructor(
    private notesService: NotesService,
    private toast: HotToastService,
    private ngbModalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {
    effect(() => {
      this.getNotes();
    });
  }

  async getNotes() {
    const res = await lastValueFrom(
      this.notesService.get({
        start_date: `${this.year()}-${this.month().toString().padStart(2, '0')}-01`,
        end_date: `${this.year()}-${this.month().toString().padStart(2, '0')}-${this.numberOfDays()
          .toString()
          .padStart(2, '0')}`,
      })
    );
    if (res.status === 200) {
      this.notes.set(res.body);
    }
  }

  async openSaveNoteModal(note?: any) {
    const modalRef: any = this.ngbModalService.open(SaveNote, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    });

    if (note) {
      modalRef.componentInstance.formModel.set(note);
    }

    const result = await modalRef.result;
    if (result) {
      this.saveNote(result);
    }
  }

  async saveNote(note: any) {
    this.spinner.show();
    const res = await lastValueFrom(
      note?.id ? this.notesService.patch(note) : this.notesService.save(note)
    );
    this.spinner.hide();
    if (res.status === 200) {
      this.toast.success('Note saved successfully!');
      if (note.id) {
        this.notes.update((notes) => notes?.map((n: any) => (n.id === note.id ? note : n)) || []);
      } else {
        this.notes.update((notes) => [
          ...(notes || []),
          {
            ...res.body,
          },
        ]);
      }
    }
  }

  async openDeleteNoteModal(noteText: string) {
    const modalRef: any = this.ngbModalService.open(Confirmation, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    });

    modalRef.componentInstance.data.set({
      title: 'Delete Note',
      message: `Are you sure you want to delete this note (${noteText})?`,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    const result = await modalRef.result;
    return result;
  }
  async deleteNote(note: any) {
    const confirmed = await this.openDeleteNoteModal(note.text);
    if (confirmed) {
      this.spinner.show();
      const res = await lastValueFrom(this.notesService.delete(note.id));
      this.spinner.hide();
      if (res.status === 200) {
        this.toast.success('Note deleted successfully!');
        this.notes.update((notes) => notes?.filter((n: any) => n.id !== note.id) || []);
      }
    }
  }
}
