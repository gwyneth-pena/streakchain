import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../shared/services/user-service';
import { HotToastService } from '@ngxpert/hot-toast';
import { of } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let userMockService: Partial<UserService>;
  let toastMock: Partial<HotToastService>;

  beforeEach(async () => {
    userMockService = {
      signIn: vi.fn().mockReturnValue(of({ status: 200, body: { message: 'Login successful!' } })),
    };

    toastMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login, RouterTestingModule],
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

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form when form is valid', async () => {
    component.signInModel.set({
      identifier: 'test@example.com',
      password: 'password',
      method: 'email',
      token: '',
    });
    fixture.detectChanges();

    component.submitForm(new Event('submit'));

    expect(component.signInForm().valid()).toBe(true);
    expect(component.isFormSubmitted).toBe(true);
    expect(await userMockService.signIn).toHaveBeenCalledWith({
      identifier: 'test@example.com',
      password: 'password',
      method: 'email',
      token: '',
    });
    expect(toastMock.success).toHaveBeenCalledWith('Login successful!');
  });
});
