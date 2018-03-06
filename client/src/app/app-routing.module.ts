import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

const routes: Routes = [
   { path: '', pathMatch: 'full', redirectTo: 'home' },
   { path: 'home', component: HomeComponent },
   { path: 'signin', component: SignInComponent },
   { path: 'signup', component: SignUpComponent },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
