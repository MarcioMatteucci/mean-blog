import { AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { AuthService } from './../services/auth.service';

export class SignUpValidators {

   static checkUsername(authService: AuthService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
         return authService.checkUsername(control.value)
            .debounceTime(400)
            .distinctUntilChanged()
            .map(isUsernameAvailable => {
               return isUsernameAvailable ? null : { 'usernameTaken': true };
            });
      };
   }

   static checkEmail(authService: AuthService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
         return authService.checkEmail(control.value)
            .debounceTime(400)
            .distinctUntilChanged()
            .map(isUsernameAvailable => {
               return isUsernameAvailable ? null : { 'emailTaken': true };
            });
      };
   }

}
