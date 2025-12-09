import { Component, effect, signal } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { email, Field, form, required } from '@angular/forms/signals';
import { UserService } from '../../shared/services/user-service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  method?: string;
  identifier?: string;
  token?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-signup',
  imports: [Header, Field, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  initialSignUpModel: SignupData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    method: 'email',
    identifier: '',
    token: '',
  };

  signUpModel = signal<SignupData>(this.initialSignUpModel);

  signUpForm = form(this.signUpModel, (schemaPath) => {
    if (this.signUpModel().method === 'email') {
      required(schemaPath.firstname, { message: 'First name is required.' });
      required(schemaPath.lastname, { message: 'Last name is required.' });
      required(schemaPath.email, { message: 'Email is required.' });
      required(schemaPath.password, { message: 'Password is required.' });
      email(schemaPath.email, { message: 'Invalid email format.' });
    }
  });

  isFormSubmitted: boolean = false;

  constructor(
    private userService: UserService,
    private toast: HotToastService,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta
  ) {
    this.title.setTitle('Signup | StreakChain');
    this.meta.addTag({ name: 'description', content: 'Sign up to start tracking your habits.' });

    effect(() => {
      this.formWatchers();
    });
  }

  ngOnInit() {
    this.initializeGoogleClient();
  }

  submitForm(event: Event) {
    event.preventDefault();
    this.isFormSubmitted = true;

    if (this.signUpForm().valid()) {
      this.signUpUser(this.signUpModel());
    }
  }

  async signUpUser(params: SignupData) {
    this.spinner.show();
    const response = await lastValueFrom(this.userService.signUp(params));
    this.spinner.hide();
    if (response.status === 200) {
      this.toast.success('Signup successful!');
      this.signUpModel.set(this.initialSignUpModel);
      this.isFormSubmitted = false;
    }
  }

  continueWithGoogle() {
    const google = (window as any).google;
    if (!google || !google.accounts) return;

    google.accounts.id.prompt();
  }

  private formWatchers() {
    const method = this.signUpModel().method;
    if (method !== 'email') return;

    this.signUpModel.update((model) => {
      model.identifier = model.email;
      return model;
    });
  }

  initializeGoogleClient() {
    const google = (window as any).google;
    google?.accounts?.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      use_fedcm_for_prompt: false,
      callback: (response: any) => {
        this.signUpUser({
          ...this.signUpModel(),
          method: 'google',
          token: response.credential,
        });
      },
    });
  }
}
