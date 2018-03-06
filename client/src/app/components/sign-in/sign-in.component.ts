import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
   selector: 'blog-sign-in',
   templateUrl: './sign-in.component.html',
   styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

   processing = false;

   hasError = false;
   errorMessage = '';

   // Form
   signInForm: FormGroup;

   username = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
   ]);

   password = new FormControl('', {
      validators: [
         Validators.required,
         Validators.minLength(6),
         Validators.maxLength(30),
         Validators.pattern('^[a-zA-Z0-9]+$')
      ]
   });

   constructor(private authService: AuthService) {
      this.createSignInForm();
   }

   createSignInForm() {
      this.signInForm = new FormGroup({
         username: this.username,
         password: this.password
      });
   }

   disableForm() {
      this.signInForm.disable();
   }

   enableForm() {
      this.signInForm.enable();
   }

   signIn() {

      this.processing = true;
      this.disableForm();

      const user = this.signInForm.value;

      this.authService.signIn(user)
         .subscribe((data: any) => {
            console.log(data);
            localStorage.setItem('token', data.tokenInfo.token);
            localStorage.setItem('exp', data.tokenInfo.exp);
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => {
               this.processing = false;
               this.signInForm.reset();
               this.enableForm();
            }, 2000);
         },
            (err: any) => {
               this.hasError = true;
               this.errorMessage = err.error.msg;
               this.processing = false;
               this.signInForm.reset();
               this.enableForm();
               setTimeout(() => {
                  this.processing = false;
                  this.hasError = false;
               }, 2000);
            });
   }

}
