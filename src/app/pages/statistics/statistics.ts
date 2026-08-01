import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Habit, HabitService } from '../../shared/services/habit-service';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { BaseChartDirective, provideCharts } from 'ng2-charts';
import {
  DoughnutController,
  ArcElement,
  Legend,
  Colors,
  Tooltip,
  ChartConfiguration,
} from 'chart.js';
import { HabitStatistics, StatisticsService } from '../../shared/services/statistics-service';
import { DateService } from '../../shared/services/date-service';

@Component({
  selector: 'app-statistics',
  imports: [DatePipe, CommonModule, BaseChartDirective],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
  providers: [
    provideCharts({
      registerables: [DoughnutController, ArcElement, Legend, Colors, Tooltip],
    }),
  ],
})
export class Statistics {
  dateToday = new Date();
  startOfMonth = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth(), 1);
  endOfMonth = new Date(this.dateToday.getFullYear(), this.dateToday.getMonth() + 1, 0);

  habits = signal<Habit[] | null>(null);
  statistics = signal<HabitStatistics | null>(null);

  appName = environment.APP_NAME;

  constructor(
    private habitsService: HabitService,
    private statisticsService: StatisticsService,
    private dateService: DateService,
    private title: Title,
    private meta: Meta,
  ) {
    this.title.setTitle(`Your Habit Analytics | ${this.appName}`);
    this.meta.addTag({ name: 'description', content: 'Check your Habit Analytics.' });
  }

  async ngOnInit() {
    const startDateStr = this.dateService.formatLocalDate(this.startOfMonth);
    const endDateStr = this.dateService.formatLocalDate(this.dateToday);
    this.habits.set(await this.getHabits());
    this.statistics.set(
      await this.getStatistics(
        startDateStr,
        endDateStr,
      ),
    );
  }

  async getHabits() {
    const habits = await lastValueFrom(this.habitsService.get());
    return habits.status === 200 ? habits.body : null;
  }

  async getStatistics(start: string, end: string) {
    const statistics = await lastValueFrom(this.statisticsService.get(start, end));
    return statistics.status === 200 ? statistics.body : null;
  }

  get doughnutChartData(): ChartConfiguration<'doughnut'>['data'] {
    const stats = this.statistics();
    const habitMap = stats?.completion_rates.percentages_per_habit ?? {};

    const keys = Object.keys(habitMap);
    const values = Object.values(habitMap);

    const colorsMapFromHabits: any = this.habits()?.reduce(
      (acc, habit) => ({
        ...acc,
        [habit.name]: habit.color,
      }),
      {},
    );
    const colors = keys.map((key: any) => colorsMapFromHabits[key]);

    return {
      labels: keys,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
        },
      ],
    };
  }

  get doughnutChartOptions(): ChartConfiguration<'doughnut'>['options'] {
    return {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom' as const,
          onClick: () => {},
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const rawValue = context.raw;
              return ` ${context.label}: ${rawValue}% completion`;
            },
          },
        },
      },
      animation: {
        animateScale: true,
      },
    };
  }
}
