import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartingPageComponent } from './starting-page/starting-page.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { BagComponent } from './bag/bag.component';
import { RequestsComponent } from './requests/requests.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SearchComponent } from './search/search.component';
import { GuestInfoComponent } from './guest-info/guest-info.component';

const routes: Routes = [
  {path: '', component: StartingPageComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'starting-page', component: StartingPageComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'bag', component: BagComponent},
  {path: 'requests', component: RequestsComponent},
  {path: 'changePassword', component: ChangePasswordComponent},
  {path: 'search', component: SearchComponent},
  {path: 'info', component: GuestInfoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
