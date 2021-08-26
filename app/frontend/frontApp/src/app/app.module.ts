import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { UsersService } from './users.service';

import { StartingPageComponent } from './starting-page/starting-page.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { NavbarUserComponent } from './navbar-user/navbar-user.component';
import { NavbarGuestComponent } from './navbar-guest/navbar-guest.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { BagComponent } from './bag/bag.component';
import { RequestsComponent } from './requests/requests.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SearchComponent } from './search/search.component';
import { GuestInfoComponent } from './guest-info/guest-info.component';

@NgModule({
  declarations: [
    AppComponent,
    StartingPageComponent,
    RegisterComponent,
    HomeComponent,
    NavbarAdminComponent,
    NavbarUserComponent,
    NavbarGuestComponent,
    OrdersComponent,
    ProfileComponent,
    NavbarComponent,
    WishlistComponent,
    BagComponent,
    RequestsComponent,
    ChangePasswordComponent,
    SearchComponent,
    GuestInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
