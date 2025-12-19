import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user-service';

export const unauthGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  let isNotAuthenticated = false;

  await userService.getCurrentUser();

  isNotAuthenticated = !userService.currentUser.is_authenticated;

  return isNotAuthenticated;
};
