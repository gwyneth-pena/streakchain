import { Component, effect, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
  isMenuCollapsed = signal(true);

  constructor(private userService: UserService, private router: Router) {
    effect(async() => {
      if (!this.userService.currentUser()) return;

      if (this.userService.currentUser().is_authenticated) {
        this.user.set(this.userService.currentUser());
      }
    });
  }

  async logout() {
    await lastValueFrom(this.userService.logout());
    this.userService.currentUser.set({ is_authenticated: false });
    this.user.set(null);
    this.router.navigate(['/']);
  }
}
