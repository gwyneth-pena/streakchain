import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../services/user-service';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(HotToastService);
  const spinner = inject(NgxSpinnerService);
  const userService = inject(UserService);
  return next(req).pipe(
    catchError((error: any) => {
      spinner.hide();
      if (error.status !== 401) {
        toast.error(error?.error?.detail?.[0]?.msg || 'An unexpected error occurred. Please try to refresh the page.');
      }
      if (error.status === 401) {
        userService.currentUser.set({ is_authenticated: false });
      }
      return throwError(() => error);
    })
  );
};
