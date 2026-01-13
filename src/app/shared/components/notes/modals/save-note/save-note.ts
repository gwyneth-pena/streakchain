import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface NotesData {
  id: string;
  text: string;
  created_at: string;
}

@Component({
  selector: 'app-save-note',
  imports: [CommonModule, Field],
  templateUrl: './save-note.html',
  styleUrl: './save-note.scss',
})
export class SaveNote {
  initialFormModel: NotesData = {
    id: '',
    text: '',
    created_at: '',
  };

  formModel = signal<NotesData>(this.initialFormModel);

  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.text, { message: 'Text is required.' });
  });

  isFormSubmitted: boolean = false;

  constructor(public ngbModalRef: NgbActiveModal) {}

  submitForm(event: Event) {
    event.preventDefault();
    if (this.form().valid()) {
      this.ngbModalRef.close(this.formModel());
    }
  }
}
