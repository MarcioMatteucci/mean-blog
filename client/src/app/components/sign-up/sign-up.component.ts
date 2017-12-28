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


  // tslint:disable-next-line:max-line-length
  regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  processing = false;

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

  disableForm() {
    this.signUpForm.disable();
  }

  enableForm() {
    this.signUpForm.enable();
  }

  clearForm() {
    this.signUpForm.reset();
  }

  passwordsMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { 'passwordsDontMatch': true };
  }

  checkUsername() {
    this.usernameValid = true;
    if (this.username.value.length >= 3 && this.username.value.length <= 50) {
      const username: string = this.username.value;

      this.authService.checkUsername(username)
        .subscribe((data: any) => {
          if (data.isUsernameAvailable) {
            this.usernameValid = true;
            this.usernameMessage = data.msg;
          } else if (!data.isUsernameAvailable) {
            this.usernameValid = false;
            this.usernameMessage = data.msg;
          }
        },
        (err: any) => {
          console.log(err);
        });
    }
  }

  checkEmail() {
    if (this.regExp.test(this.email.value)) {
      const email = this.email.value;

      this.authService.checkEmail(email)
        .subscribe((data: any) => {
          if (data.isEmailAvailable) {
            this.emailValid = true;
            this.emailMessage = data.msg;
          } else if (!data.isEmailAvailable) {
            this.emailValid = false;
            this.emailMessage = data.msg;
          }
        },
        (err: any) => {
          console.log(err);
        });
    }
  }

  signUp() {

    this.processing = true;
    this.disableForm();

    const newUser = this.signUpForm.value;

    this.authService.signUp(newUser)
      .subscribe((data: any) => {
        localStorage.setItem('token', data.tokenInfo.token);
        localStorage.setItem('exp', data.tokenInfo.exp);
        setTimeout(() => {
          this.processing = false;
          this.signUpForm.reset();
          this.enableForm();
        }, 2000);
      },
      (err: any) => {
        console.log(err);
      });
  }

  ngOnInit() {
  }

}
