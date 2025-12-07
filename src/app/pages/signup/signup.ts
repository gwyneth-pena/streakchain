import { Component, signal } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { email, Field, form, required } from '@angular/forms/signals';
import { UserService } from '../../shared/services/user-service';

interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-signup',
  imports: [Header, Field],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private signUpModel = signal<SignupData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  signUpForm = form(this.signUpModel, (schemaPath) => {
    required(schemaPath.firstname, { message: 'First name is required.' });
    required(schemaPath.lastname, { message: 'Last name is required.' });
    required(schemaPath.email, { message: 'Email is required.' });
    required(schemaPath.password, { message: 'Password is required.' });
    email(schemaPath.email, { message: 'Invalid email format.' });
  });

  constructor(private userService: UserService) {}

  submitForm() {}
}
