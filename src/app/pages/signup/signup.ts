import { Component, effect, signal } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { email, Field, form, required } from '@angular/forms/signals';
import { UserService } from '../../shared/services/user-service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';

interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  method?: string;
  identifier?: string;
}

@Component({
  selector: 'app-signup',
  imports: [Header, Field, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private signUpModel = signal<SignupData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    method: 'email',
    identifier: '',
  });

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
    private spinner: NgxSpinnerService
  ) {
    effect(() => {
      this.formWatchers();
    });
  }

  private formWatchers() {
    const method = this.signUpModel().method;
    if (method !== 'email') return;

    this.signUpModel.update((model) => {
      model.identifier = model.email;
      return model;
    });
  }

  submitForm(event: Event) {
    event.preventDefault();
    this.isFormSubmitted = true;

    if (this.signUpForm().valid()) {
      this.signUpUser(this.signUpModel());
    }
  }

  private async signUpUser(params: SignupData) {
    this.spinner.show();
    const response = await lastValueFrom(this.userService.signUp(params));
    this.spinner.hide();
    if (response.status === 200) {
      this.toast.success('Signup successful!');
    }
  }
}
