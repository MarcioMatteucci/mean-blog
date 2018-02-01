import { AsyncValidatorFn, ValidationErrors, AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { AuthService } from './../services/auth.service';

export class SignUpValidators {

   static usernameValidator(authService: AuthService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
         return authService.checkUsername(control.value)
            .map(isUsernameAvailable => {
               return isUsernameAvailable ? null : { 'usernameTaken': true };
            });

         // return control.valueChanges
         //    .debounceTime(500)
         //    .distinctUntilChanged()
         //    .switchMap(username => {
         //       return authService.checkUsername(username)
         //          .map(isUsernameAvailable => {
         //             console.log(isUsernameAvailable);
         //             return isUsernameAvailable ? null : { 'usernameTaken': true };
         //          });
         //    });
      };
   }

   static emailValidator(authService: AuthService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {

         return authService.checkEmail(control.value)
            .map(isEmailAvailable => {
               return isEmailAvailable ? null : { 'emailTaken': true };
            });

         // return control.valueChanges
         //    .debounceTime(500)
         //    .distinctUntilChanged()
         //    .switchMap(email => {
         //       console.log(email);
         //       return authService.checkEmail(email)
         //          .map(isEmailAvailable => {
         //             return isEmailAvailable ? null : { 'emailTaken': true };
         //          });
         //    });
      };
   }

   static passwordsMatchValidator(fg: FormGroup): ValidationErrors | null {
      return fg.get('password').value === fg.get('confirmPassword').value
         ? null : { 'passwordsDontMatch': true };
   }

}
