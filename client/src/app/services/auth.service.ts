import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { User } from './../models/user.model';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  signUp(user: User) {
    return this.http.post(this.apiUrl + 'auth/signUp', user);
  }

  checkUsername(username: string) {
    return this.http.get(this.apiUrl + 'auth/checkUsername?username=' + username);
  }

  checkEmail(email: string) {
    return this.http.get(this.apiUrl + 'auth/checkEmail?email=' + email);
  }
}
