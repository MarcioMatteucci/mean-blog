// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Services
import { AuthService } from './services/auth.service';

// Validators
import { SignUpValidators } from './validators/sign-up.validator';

// Components
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';



@NgModule({
   declarations: [
      AppComponent,
      SignUpComponent,
      SignInComponent,
      NavbarComponent,
      HomeComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      ReactiveFormsModule,
      FormsModule,
      HttpClientModule
   ],
   providers: [
      AuthService,
      SignUpValidators
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
