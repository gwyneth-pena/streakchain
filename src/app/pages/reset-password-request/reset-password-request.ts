import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { email, Field, form, required } from '@angular/forms/signals';
import { Meta, Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../shared/services/user-service';
import { lastValueFrom } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password-request',
  imports: [CommonModule, Field, RouterLink],
  templateUrl: './reset-password-request.html',
  styleUrl: './reset-password-request.scss',
})
export class ResetPasswordRequest {
  initialForgotPasswordModel = {
    email: '',
  };

  forgotPasswordModel = signal(this.initialForgotPasswordModel);

  forgotPasswordForm = form(this.forgotPasswordModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required.' });
    email(schemaPath.email, { message: 'Invalid email format.' });
  });

  isFormSubmitted: boolean = false;
  appName = environment.APP_NAME;

  constructor(
    private title: Title,
    private meta: Meta,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private toast: HotToastService
  ) {
    this.title.setTitle(`Reset Password | ${this.appName}`);
    this.meta.addTag({
      name: 'description',
      content: 'Reset your password to regain access to your account.',
    });
  }

  async submitForm(event: Event) {
    event.preventDefault();
    this.isFormSubmitted = true;

    if (!this.forgotPasswordForm().valid()) return;

    this.spinner.show();
    const res = await lastValueFrom(
      this.userService.requestPasswordReset({
        email: this.forgotPasswordForm().value().email,
      })
    );
    this.spinner.hide();

    if (res.status === 200) {
      this.toast.success(res.body.message);
      this.forgotPasswordModel.set(this.initialForgotPasswordModel);
      this.isFormSubmitted = false;
    }
  }
}
