import { Component } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateHabit } from './modals/create-habit/create-habit';
import { HabitService } from '../../shared/services/habit-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HotToastService } from '@ngxpert/hot-toast';
import { Meta, Title } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-habit-tracker',
  imports: [NgbModule],
  templateUrl: './habit-tracker.html',
  styleUrl: './habit-tracker.scss',
})
export class HabitTracker {
  currentMonthYear: { month: string; year: number; date: Date } = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    date: new Date(),
  };

  constructor(
    private ngbModalService: NgbModal,
    private habitsService: HabitService,
    private toast: HotToastService,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta
  ) {
    this.title.setTitle('Habit Tracker | StreakChain');
    this.meta.addTag({ name: 'description', content: 'Track your habits.' });
  }

  getNewCurrentMonthYear(monthIncrement: number) {
    const currentDate = this.currentMonthYear.date;
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthIncrement,
      currentDate.getDate()
    );
    this.currentMonthYear = {
      month: newDate.toLocaleString('default', { month: 'long' }),
      year: newDate.getFullYear(),
      date: newDate,
    };
  }

  async openCreateHabitModal() {
    const modalRef: any = this.ngbModalService.open(CreateHabit, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    });

    const result = await modalRef.result;
    if (result) {
      this.saveHabit(result);
    }
  }

  async saveHabit(habit: any) {
    this.spinner.show();
    const res = await lastValueFrom(this.habitsService.save(habit));
    this.spinner.hide();
    if (res.status === 200) {
      this.toast.success('Habit saved successfully!');
    }
  }
}
