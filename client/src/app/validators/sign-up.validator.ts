import { AsyncValidatorFn, ValidationErrors, AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

import { AuthService } from './../services/auth.service';

export class SignUpValidators {

   static usernameValidator(authService: AuthService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
         return Observable.timer(500)
            .switchMap(() => {
               return authService.checkUsername(control.value)
                  .map(isUsernameAvailable => {
                     return isUsernameAvailable ? null : { 'usernameTaken': true };
                  });
            });
      };
   }

   static emailValidator(authService: AuthService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
         return Observable.timer(500)
            .switchMap(() => {
               return authService.checkEmail(control.value)
                  .map(isEmailAvailable => {
                     return isEmailAvailable ? null : { 'emailTaken': true };
                  });
            });
      };
   }

   static passwordsMatchValidator(fg: FormGroup): ValidationErrors | null {
      return fg.get('password').value === fg.get('confirmPassword').value
         ? null : { 'passwordsDontMatch': true };
   }

}
