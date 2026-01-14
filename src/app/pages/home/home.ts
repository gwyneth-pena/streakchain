import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  year = new Date().getFullYear();

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Home | StreakChain');
    this.meta.addTag({
      name: 'description',
      content: 'Track your habits and unlock your productivity potential.',
    });
  }

  ngAfterViewInit() {
    this.loadContactForm();
  }

  loadContactForm() {
    const script = document.createElement('script');
    script.src = 'https://js-na2.hsforms.net/forms/embed/244012357.js';
    script.defer = true;

    script.onload = () => {
      console.log('HubSpot script loaded');
    };

    document.body.appendChild(script);

    const target = document.getElementById('hubspot-form');
    if (target) {
      target.setAttribute('data-region', 'na2');
      target.setAttribute('data-form-id', 'b85d658a-d716-4d68-b49b-4e210f3a8a38');
      target.setAttribute('data-portal-id', '244012357');
    }
  }
}
