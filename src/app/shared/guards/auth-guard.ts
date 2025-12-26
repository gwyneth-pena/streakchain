import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  try {
    const currentUser = await userService.getCurrentUser();
    if (!currentUser().is_authenticated) {
      router.navigate(['/login'], {});
      return false;
    }
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
