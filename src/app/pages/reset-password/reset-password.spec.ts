import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPassword } from './reset-password';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../shared/services/user-service';
import { HotToastService } from '@ngxpert/hot-toast';
import { of } from 'rxjs';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let userMockService: Partial<UserService>;
  let toastMock: Partial<HotToastService>;

  beforeEach(async () => {
    userMockService = {
      resetPassword: vi
        .fn()
        .mockReturnValue(of({ status: 200, body: { message: 'Password reset successfully.' } })),
    };

    toastMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ResetPassword, RouterTestingModule],
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

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form when form is valid', async() => {
    component.forgotPasswordModel.set({
      new_password: 'password',
      confirm_password: 'password',
    });
    fixture.detectChanges();
    component.token = 'token';

    component.submitForm(new Event('submit'));

    expect(component.forgotPasswordForm().valid()).toBe(true);
    expect(component.isFormSubmitted).toBe(true);
    expect(component.forgotPasswordModel().new_password).toBe('password');
    expect(component.token).toBe('token');
    expect(await userMockService.resetPassword).toHaveBeenCalledWith({
      new_password: 'password',
      token: 'token',
    });
    expect(toastMock.success).toHaveBeenCalledWith('Password reset successfully.');
    
  });
});
