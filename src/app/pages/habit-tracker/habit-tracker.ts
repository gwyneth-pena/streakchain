import { Component, effect, signal } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateHabit } from './modals/create-habit/create-habit';
import { HabitService } from '../../shared/services/habit-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HotToastService } from '@ngxpert/hot-toast';
import { Meta, Title } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-habit-tracker',
  imports: [NgbModule, CommonModule],
  templateUrl: './habit-tracker.html',
  styleUrl: './habit-tracker.scss',
})
export class HabitTracker {
  habits = signal<any[]>([]);
  calendarDays = signal<any[]>([]);

  currentMonthYear: { month: string; year: number; date: Date; monthNumber: number } = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    date: new Date(),
    monthNumber: new Date().getMonth() + 1,
  };

  dayNames: { [key: string]: string } = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
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

    effect(() => {
      this.getCalendarDays();
      this.getHabits();
    });
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
      monthNumber: newDate.getMonth() + 1,
    };
  }

  onCurrentMonthYearChange(monthIncrement: number) {
    this.getNewCurrentMonthYear(monthIncrement);
    this.getCalendarDays();
    this.getHabits();
  }

  getCalendarDays() {
    const { monthNumber, year } = this.currentMonthYear;
    const numberOfDays = new Date(year, monthNumber, 0).getDate();
    const today = new Date();
    const calendarDays = [];

    for (let i = 1; i <= numberOfDays; i++) {
      const date = new Date(year, monthNumber - 1, i);
      calendarDays.push({
        day: i,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        dayName: this.dayNames[date.getDay()],
      });
    }

    this.calendarDays.set(calendarDays);
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

  async getHabits() {
    this.spinner.show();
    const res = await lastValueFrom(this.habitsService.get());
    this.spinner.hide();
    if (res.status === 200) {
      this.habits.set(res.body);
    }
  }

  async saveHabit(habit: any) {
    this.spinner.show();
    const res = await lastValueFrom(this.habitsService.save(habit));
    this.spinner.hide();
    if (res.status === 200) {
      this.toast.success('Habit saved successfully!');
      this.getHabits();
    }
  }
}
