import { Component, effect, signal } from '@angular/core';
import { email, Field, form, minLength, required } from '@angular/forms/signals';
import { UserService } from '../../shared/services/user-service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta, Title } from '@angular/platform-browser';
import { GoogleSignInButton } from '../../shared/components/google-sign-in-button/google-sign-in-button';
import { Router, RouterLink, RouterModule } from '@angular/router';

interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  method?: string;
  identifier?: string;
  token?: string;
}

@Component({
  selector: 'app-signup',
  imports: [Field, CommonModule, GoogleSignInButton, RouterLink, RouterModule],
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
      minLength(schemaPath.password, 8, {
        message: 'Password must be at least 8 characters long.',
      });
      email(schemaPath.email, { message: 'Invalid email format.' });
    }
  });

  isFormSubmitted: boolean = false;
  isGooglePromptOpen = false;

  constructor(
    private userService: UserService,
    private toast: HotToastService,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {
    this.title.setTitle('Sign Up | StreakChain');
    this.meta.addTag({ name: 'description', content: 'Sign up to start tracking your habits.' });

    effect(() => {
      this.formWatchers();
    });
  }

  submitForm(event: Event) {
    event.preventDefault();
    this.isFormSubmitted = true;

    if (this.signUpForm().valid()) {
      this.signUpUser(this.signUpModel());
    }
  }

  handleGoogleSignUp(token: string) {
    this.signUpUser({
      ...this.signUpModel(),
      method: 'google',
      token,
    });
  }

  async signUpUser(params: SignupData) {
    this.spinner.show();
    const response = await lastValueFrom(this.userService.signUp(params));
    this.spinner.hide();
    if (response.status === 200) {
      this.toast.success('Signup successful!');
      this.signUpModel.set(this.initialSignUpModel);
      this.isFormSubmitted = false;
      this.router.navigate(['/habit-tracker']);
    }
  }

  private formWatchers() {
    const method = this.signUpModel().method;
    if (method !== 'email') return;

    this.signUpModel.update((model) => {
      model.identifier = model.email;
      return model;
    });
  }
}
