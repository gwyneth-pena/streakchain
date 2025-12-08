import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Signup } from './signup';
import { vi } from 'vitest';
import { UserService } from '../../shared/services/user-service';
import { of, throwError } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let userMockService: Partial<UserService>;
  let toastMock: Partial<HotToastService>;

  beforeEach(async () => {
    
    userMockService = {
      signUp: vi.fn().mockReturnValue(of({ status: 200 })),
    };

    toastMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Signup, RouterTestingModule],
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

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set identifier to email when method is email', () => {
    component.signUpModel.set({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      method: 'email',
      identifier: '',
    });
    component['formWatchers']();
    expect(component.signUpModel().identifier).toBe('john.doe@example.com');
  });

  it('should submit form when form is valid', async () => {
    component.signUpModel.set({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      method: 'email',
      identifier: '',
    });
    component['formWatchers']();
    await component.submitForm(new Event('submit'));
    expect(userMockService.signUp).toHaveBeenCalledWith(component.signUpModel());
  });

  it('should show success toast when sign up is successful', async () => {
    component.signUpModel.set({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      method: 'email',
      identifier: '',
    });
    component['formWatchers']();
    await component.submitForm(new Event('submit'));
    expect(toastMock.success).toHaveBeenCalledWith('Signup successful!');
  });
});
