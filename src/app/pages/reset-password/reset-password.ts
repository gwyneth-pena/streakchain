import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Field, form, minLength, required, validate } from '@angular/forms/signals';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../shared/services/user-service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, Field, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  initialForgotPasswordModel = {
    new_password: '',
    confirm_password: '',
  };

  forgotPasswordModel = signal(this.initialForgotPasswordModel);

  forgotPasswordForm = form(this.forgotPasswordModel, (schemaPath: any) => {
    required(schemaPath.new_password, { message: 'New password is required.' });
    required(schemaPath.confirm_password, { message: 'Confirm password is required.' });
    minLength(schemaPath.new_password, 8, {
      message: 'Password must be at least 8 characters long.',
    });

    validate(schemaPath.confirm_password, ({ value, valueOf }) => {
      const confirm = value();
      const newPassword = valueOf(schemaPath.new_password);
      if (confirm !== newPassword && newPassword !== '') {
        return { message: 'Passwords do not match.', kind: 'passwordMismatch' };
      }
      return null;
    });
  });

  isFormSubmitted: boolean = false;

  token: string = '';

  constructor(
    private title: Title,
    private meta: Meta,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toast: HotToastService
  ) {
    this.title.setTitle('Reset Password | StreakChain');
    this.meta.addTag({
      name: 'description',
      content: 'Reset your password to regain access to your account.',
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  async submitForm(event: Event) {
    event.preventDefault();
    this.isFormSubmitted = true;

    if (!this.forgotPasswordForm().valid()) return;

    this.spinner.show();
    const res = await lastValueFrom(
      this.userService.resetPassword({
        token: this.token,
        new_password: this.forgotPasswordForm().value().new_password,
      })
    );
    this.spinner.hide();

    if (res.status === 200) {
      this.toast.success(res.body.message);
      this.forgotPasswordModel.set(this.initialForgotPasswordModel);
      this.isFormSubmitted = false;
    }
    this.router.navigate(['/login']);
  }
}
