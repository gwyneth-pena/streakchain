import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(HotToastService);
  const spinner = inject(NgxSpinnerService);
  return next(req).pipe(
    catchError((error: any) => {
      toast.error(error?.error?.detail?.[0]?.msg || 'An unexpected error occurred.');
      spinner.hide();
      return throwError(() => error);
    })
  );
};
