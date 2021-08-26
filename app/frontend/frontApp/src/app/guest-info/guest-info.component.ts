import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.css']
})
export class GuestInfoComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;
  bag: any;
  name: string;
  surname: string;
  address: string;
  city: string;
  phone: string;

  messageName: string;
  messageSurname: string;
  messageAddress: string;
  messageCity: string;
  messagePhone: string;

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser != null) {
      if (this.currentUser.type == "user") {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/requests']);
      }
    }
    this.bag = JSON.parse(localStorage.getItem('bag'));
  }
  
  checkPhone(phone): any{
    let regexp = /^(\d{3})\/(\d{3})\-(\d{3,4})$/;
    return regexp.test(phone);
  }

  order() {
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

    if (this.messageSurname != "" || this.messagePhone != "" || this.messageName != "" 
    || this.messageCity != "" || this.messageAddress != "") return;

    //provera formata kontakt telefona
    if (!this.checkPhone(this.phone)){
      this.messagePhone = "Telefon mora da bude formata xxx/xxx-xxx{x}!";
    }
    
    if (this.messagePhone != "") {
      return;
    }

    this.userService.order(this.bag.books, 0, this.bag.price, this.name, this.surname,
      this.address, this.city, this.phone).subscribe((o: any) => {
        if (o != null) {
          localStorage.removeItem('bag');
          this.bag = null;
          this.currentUser = null;
          window.alert("Narudžbina uspešna!");
          this.router.navigate(['/home']);
        } else {
          window.alert("Pokušajte ponovo!");
        }
      })
  }

}
