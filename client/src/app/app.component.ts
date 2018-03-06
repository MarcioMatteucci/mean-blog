import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'blog-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

   constructor(
      private authService: AuthService
   ) { }

   ngOnInit() {
      if (!this.authService.isLoggedIn()) {
         localStorage.clear();
      }
   }
}
