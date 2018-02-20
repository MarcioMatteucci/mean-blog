import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth.service';
import { SignUpValidators } from './../../validators/sign-up.validator';

@Component({
   selector: 'blog-sign-up',
   templateUrl: './sign-up.component.html',
   styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

   // tslint:disable-next-line:max-line-length
   emailRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

   processing = false;

   // Form
   signUpForm: FormGroup;

   // Form Controls
   name = new FormControl('', {
      validators: [
         Validators.required,
         Validators.minLength(2),
         Validators.maxLength(30)
      ]
   });
   lastname = new FormControl('', {
      validators: [
         Validators.required,
         Validators.minLength(2),
         Validators.maxLength(50)
      ]
   });
   username = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
   ], [SignUpValidators.usernameValidator(this.authService)]);

   password = new FormControl('', {
      validators: [
         Validators.required,
         Validators.minLength(6),
         Validators.maxLength(30),
         Validators.pattern('^[a-zA-Z0-9]+$')
      ]
   });
   confirmPassword = new FormControl('', {
      validators: [
         Validators.required,
         Validators.minLength(6),
         Validators.maxLength(30)
      ]
   });
   email = new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailRegExp)
   ], [SignUpValidators.emailValidator(this.authService)]);


   constructor(private authService: AuthService) {
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
      }, SignUpValidators.passwordsMatchValidator);
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

}
