import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';

export const unauthGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  try {
    const currentUser = await userService.getCurrentUser();
    if (currentUser().is_authenticated) {
      router.navigate(['/habit-tracker']);
      return false;
    }
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
