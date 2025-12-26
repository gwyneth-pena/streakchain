import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordRequest } from './reset-password-request';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../shared/services/user-service';
import { HotToastService } from '@ngxpert/hot-toast';
import { of } from 'rxjs';

describe('ResetPasswordRequest', () => {
  let component: ResetPasswordRequest;
  let fixture: ComponentFixture<ResetPasswordRequest>;
  let userMockService: Partial<UserService>;
  let toastMock: Partial<HotToastService>;

  beforeEach(async () => {
    userMockService = {
      requestPasswordReset: vi
        .fn()
        .mockReturnValue(
          of({ status: 200, body: { message: 'Password reset link has been sent to your email.' } })
        ),
    };

    toastMock = {
      success: vi.fn(),
      error: vi.fn(),
    };
    
    await TestBed.configureTestingModule({
      imports: [ResetPasswordRequest, RouterTestingModule],
      providers: [
        {
          provide: UserService,
          useValue: userMockService,
        },
        {
          provide: HotToastService,
          useValue: toastMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form when form is valid', async () => {
    component.forgotPasswordModel.set({
      email: 'email@example.com',
    });
    fixture.detectChanges();

    component.submitForm(new Event('submit'));

    expect(component.forgotPasswordForm().valid()).toBe(true);
    expect(component.isFormSubmitted).toBe(true);
    expect(component.forgotPasswordModel().email).toBe('email@example.com');
    expect(userMockService.requestPasswordReset).toHaveBeenCalledWith({
      email: 'email@example.com',
    });
    await Promise.resolve();
    expect(toastMock.success).toHaveBeenCalledWith(
      'Password reset link has been sent to your email.'
    );
  });
});
