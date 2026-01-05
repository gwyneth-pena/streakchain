import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Home | StreakChain');
    this.meta.addTag({
      name: 'description',
      content: 'Track your habits and unlock your productivity potential.',
    });
  }
}
