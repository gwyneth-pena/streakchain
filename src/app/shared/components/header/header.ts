import { Component, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  user: any = signal(null);

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.getCurrentUser();
  }

  async getCurrentUser() {
    const user = await this.userService.getCurrentUser();
    this.user.set(user);
  }

  async logout() {
    await lastValueFrom(this.userService.logout());
    this.userService.currentUser = { is_authenticated: false };
    this.user.set(null);
  }
}
