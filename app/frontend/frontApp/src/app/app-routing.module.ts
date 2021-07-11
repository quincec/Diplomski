import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartingPageComponent } from './starting-page/starting-page.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', component: StartingPageComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'starting-page', component: StartingPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
