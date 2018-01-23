import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { User } from './../models/user.model';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

   apiUrl = environment.apiUrl;

   constructor(
      private http: HttpClient
   ) { }

   signUp(user: User) {
      return this.http.post(this.apiUrl + 'auth/signUp', user);
   }

   checkUsername(username: string): Observable<boolean> {
      return this.http.get(this.apiUrl + 'auth/checkUsername?username=' + username)
         .map((res: any) => res.isUsernameAvailable);
   }

   checkEmail(email: string) {
      return this.http.get(this.apiUrl + 'auth/checkEmail?email=' + email)
         .map((res: any) => res.isEmailAvailable);
   }
}
