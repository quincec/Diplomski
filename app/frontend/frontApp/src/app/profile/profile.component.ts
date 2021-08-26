import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import { User } from '../user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;

  name: String;
  surname: String;
  username: String;
  address: String;
  city: String;
  phone: String;
  email: String;

  messageName: String = '';
  messageSurname: String = '';
  messageAddress: String = '';
  messageCity: String = '';
  messagePhone: String = '';

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser == null) {
      this.router.navigate(['/home']);
    }
    if (this.currentUser != null && this.currentUser.type == "admin") {
      this.router.navigate(['/requests']);
    }
    this.name = this.currentUser.name;
    this.surname = this.currentUser.surname;
    this.username = this.currentUser.username;
    this.email = this.currentUser.email;
    this.address = this.currentUser.address;
    this.city = this.currentUser.city;
    this.phone = this.currentUser.phone;
  }

 checkPhone(phone): any{
   let regexp = /^(\d{3})\/(\d{3})\-(\d{3,4})$/;
   return regexp.test(phone);
 }

  saveChanges() {
    window.scroll(0,0);
    //setujem sve poruke na ""
    this.messageName = ""; this.messageSurname = ""; this.messageAddress = ""; this.messageCity = ""; this.messagePhone = "";

    //provera da li su sva polja popunjena
    if (this.name == null || this.name == "") {
      this.messageName = "Niste uneli ime!";
    }
    if (this.surname == null || this.surname == "") {
      this.messageSurname = "Niste uneli prezime!";
    }
    if (this.address == null || this.address == "") {
      this.messageAddress = "Niste uneli adresu!";
    }
    if (this.city == null || this.city == "") {
      this.messageCity = "Niste uneli grad!";
    }
    if (this.phone == null || this.phone == "") {
      this.messagePhone = "Niste uneli telefon!";
    }

    if (this.messageSurname != "" || this.messagePhone != "" || this.messageName != "" || 
    this.messageCity != "" || this.messageAddress != "") return;

    //provera formata kontakt telefona
    if (!this.checkPhone(this.phone)){
      this.messagePhone = "Telefon mora da bude formata xxx/xxx-xxx{x}!";
    }

    if (this.messageSurname != "" || this.messagePhone != "" ||
      this.messageName != "" || this.messageCity != "" || this.messageAddress != "") {
        return;
      }

    //napravi novi zahtev za registraciju
    this.userService.saveProfileChanges(this.currentUser.username, this.name, this.surname, this.phone, this.address, this.city).subscribe((u : User) => {
      window.alert("Promene su uspešno sačuvane!");
      this.currentUser = u;
      localStorage.removeItem('korisnik');
      localStorage.setItem('korisnik', JSON.stringify(this.currentUser));
      this.router.navigate(['/profile']);
    })
  }
}
