import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Field, form, min, max, required, validate } from '@angular/forms/signals';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorService } from '../../../../shared/services/color-service';

interface CreateHabitData {
  name: string;
  frequency: number;
  color: string;
}

@Component({
  selector: 'app-create-habit',
  imports: [NgbModule, Field, CommonModule],
  templateUrl: './create-habit.html',
  styleUrl: './create-habit.scss',
})
export class CreateHabit {
  initialFormModel: CreateHabitData = {
    name: '',
    frequency: 1,
    color: '#9db2ff',
  };

  formModel = signal<CreateHabitData>(this.initialFormModel);

  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required.' });
    required(schemaPath.frequency, { message: 'Frequency is required.' });
    min(schemaPath.frequency, 1, { message: 'Frequency must be greater than 0.' });
    max(schemaPath.frequency, 31, { message: 'Frequency must be less than 31.' });
    validate(schemaPath.color, ({ value }) => {
      const color = value();
      const { s, l } = this.colorService.hexToHsl(color);
      const isWhitish = s <= 30 && l >= 75;
      if (isWhitish) {
        return { message: 'Color must be darker.', kind: 'colorShouldBeDarker' };
      }
      return null;
    });
  });

  isFormSubmitted: boolean = false;

  constructor(public ngbModalRef: NgbActiveModal, private colorService: ColorService) {}

  submitForm(event: Event) {
    event.preventDefault();
    this.isFormSubmitted = true;
    if (this.form().valid()) {
      this.ngbModalRef.close(this.formModel());
    }
  }
}
