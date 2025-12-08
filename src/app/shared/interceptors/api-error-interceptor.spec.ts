import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { apiErrorInterceptor } from './api-error-interceptor';
import { HotToastService } from '@ngxpert/hot-toast';
import { of, throwError } from 'rxjs';

describe('apiErrorInterceptor', () => {
  let toastMock: Partial<HotToastService>;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => apiErrorInterceptor(req, next));

  beforeEach(() => {
    toastMock = {
      error: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HotToastService,
          useValue: toastMock,
        },
      ],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call toast.error when error is thrown', () => {
    const req = new HttpRequest('GET', 'http://localhost:8000/users/create');
    const next = vi
      .fn()
      .mockReturnValue(throwError(() => ({ error: { detail: [{ msg: 'Invalid email' }] } })));

    interceptor(req, next).subscribe({
      next: () => {},
      error: () => {
        expect(toastMock.error).toHaveBeenCalledWith('Invalid email');
      },
    });
  });
});
