import { Component, effect, signal } from '@angular/core';
import { HabitLogsPerYear, HabitLogService } from '../../shared/services/habit-log-service';
import { Habit, HabitService } from '../../shared/services/habit-service';
import { Meta, Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-yearly-streaks',
  imports: [CommonModule],
  templateUrl: './yearly-streaks.html',
  styleUrl: './yearly-streaks.scss',
})
export class YearlyStreaks {
  currentYear = signal(new Date().getFullYear());
  months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };
  monthEntries = Object.entries(this.months);
  habits = signal<Habit[] | null>(null);
  habitLogsByYear = signal<HabitLogsPerYear | null>({});

  constructor(
    private habitLogService: HabitLogService,
    private habitService: HabitService,
    private title: Title,
    private meta: Meta,
    private spinner: NgxSpinnerService,
  ) {
    this.title.setTitle('Yearly Streaks | StreakChain');
    this.meta.addTag({ name: 'description', content: 'Check your yearly streaks.' });

    effect(() => {
      if (this.habits()) {
        this.getHabitLogsByYear();
      }
    });
  }

  ngOnInit() {
    this.getHabits();
  }

  incrementDecrementYear(increment: number) {
    this.currentYear.set(this.currentYear() + increment);
  }

  async getHabits() {
    this.spinner.show();
    const res = await lastValueFrom(this.habitService.get());
    this.spinner.hide();
    if (res.status === 200) {
      this.habits.set(res.body || null);
    }
  }

  async getHabitLogsByYear() {
    this.spinner.show();
    const res = await lastValueFrom(this.habitLogService.get(this.currentYear()));
    this.spinner.hide();
    if (res.status === 200) {
      this.habitLogsByYear.set(res.body || {});
    }
  }
}
