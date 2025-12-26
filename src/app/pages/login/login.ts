import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { email, Field, form, required } from '@angular/forms/signals';
import { Meta, Title } from '@angular/platform-browser';
import { UserService } from '../../shared/services/user-service';
import { lastValueFrom } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HotToastService } from '@ngxpert/hot-toast';
import { GoogleSignInButton } from '../../shared/components/google-sign-in-button/google-sign-in-button';
import { Router, RouterModule } from '@angular/router';

interface SignInData {
  identifier: string;
  password: string;
  method?: string;
  token?: string;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, Field, GoogleSignInButton, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  initialSignInModel: SignInData = {
    password: '',
    method: 'email',
    identifier: '',
    token: '',
  };

  signInModel = signal<SignInData>(this.initialSignInModel);

  signInForm = form(this.signInModel, (schemaPath) => {
    if (this.signInModel().method === 'email') {
      required(schemaPath.identifier, { message: 'Email is required.' });
      required(schemaPath.password, { message: 'Password is required.' });
      email(schemaPath.identifier, { message: 'Invalid email format.' });
    }
  });

  isFormSubmitted: boolean = false;

  constructor(
    private title: Title,
    private meta: Meta,
    private userService: UserService,
    private toast: HotToastService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.title.setTitle('Login | StreakChain');
    this.meta.addTag({ name: 'description', content: 'Sign in to your account.' });
  }

  async signInUser(params: SignInData) {
    this.spinner.show();
    try {
      const response = await lastValueFrom(this.userService.signIn(params));
      this.spinner.hide();
      if (response.status === 200) {
        this.toast.success('Login successful!');
        this.signInModel.set(this.initialSignInModel);
        this.isFormSubmitted = false;
        this.router.navigate(['/habit-tracker']);
      }
    } catch (error) {
      this.toast.error('Invalid credentials. Please try again.');
    } finally {
      this.spinner.hide();
    }
  }

  handleGoogleSignIn(token: string) {
    this.signInUser({
      ...this.signInModel(),
      method: 'google',
      token,
    });
  }

  submitForm(event: Event) {
    event.preventDefault();
    this.isFormSubmitted = true;
    if (this.signInForm().valid()) {
      this.signInUser(this.signInModel());
    }
  }
}
