import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { User } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'blog-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  // Form
  signUpForm: FormGroup;

  // Form Controls
  name = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ],
    updateOn: 'change'
  });
  lastname = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ],
    updateOn: 'change'
  });
  username = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ],
    updateOn: 'change'
  });
  password = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z0-9]+$')
    ],
    updateOn: 'change'
  });
  confirmPassword = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
    ],
    updateOn: 'change'
  });
  email = new FormControl('', {
    validators: [
      Validators.required,
      Validators.email
    ],
    updateOn: 'change'
  });


  constructor(
    private authService: AuthService
  ) {
    this.createSignUpForm();
  }

  createSignUpForm() {
    this.signUpForm = new FormGroup({
      name: this.name,
      lastname: this.lastname,
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword,
      email: this.email
    }, this.passwordsMatchValidator);
  }

  passwordsMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { 'passwordsDontMatch': true };
  }

  signUp() {
    const newUser = this.signUpForm.value;

    this.authService.signUp(newUser)
      .subscribe((data: any) => {
        console.log(data);
        // localStorage.setItem('token', data.token);
      },
      (err: any) => {
        console.log(err);
      });
  }

  ngOnInit() {
  }

}
