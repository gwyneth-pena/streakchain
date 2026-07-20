import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Habit, HabitService } from '../../shared/services/habit-service';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-statistics',
  imports: [DatePipe, CommonModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {
  date_today = new Date();
  start_of_month = new Date(this.date_today.getFullYear(), this.date_today.getMonth(), 1);
  end_of_month = new Date(this.date_today.getFullYear(), this.date_today.getMonth() + 1, 0);

  habits = signal<Habit[] | null>(null);

  appName = environment.APP_NAME;

  constructor(
    private habitsService: HabitService,
    private title: Title,
    private meta: Meta,
  ) {
    this.title.setTitle(`Your Habit Analytics | ${this.appName}`);
    this.meta.addTag({ name: 'description', content: 'Check your Habit Analytics.' });
  }

  async ngOnInit() {
    this.habits.set(await this.getHabits());
  }

  async getHabits() {
    const habits = await lastValueFrom(this.habitsService.get());
    return habits.status === 200 ? habits.body : null;
  }
}
