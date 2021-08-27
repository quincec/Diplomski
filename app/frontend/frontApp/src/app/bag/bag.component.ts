import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-bag',
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.css']
})
export class BagComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;
  bag: any;
  books: any = [];
  totalPrice: any;


  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser != null && this.currentUser.type == "admin") {
        this.router.navigate(['/requests']);
    }
    this.bag = JSON.parse(localStorage.getItem('bag'));
    if (this.bag != null) {
      this.books = this.bag.books;
      this.totalPrice = this.bag.price;
    }
  }

  convertToFloat(numToConvert: String): any {
    let num = new String(numToConvert);
    if (num.includes(".")) {
      let temp = num.split(".");
      num = "";
      for (let j = 0; j < temp.length; j++) {
        num += temp[j];
      }
    }
    let temp = num.split(",");
    let retValue = temp[0] + "." + temp[1];
    let floatValue = parseFloat(retValue);
    return floatValue;
  }

  removeFromBag(b: any) {
    let currentBag = this.bag;
    let books = currentBag.books;
    let index = 0;

    for (let i = 0; i < books.length; i++) {
      if (books[i].link == b.link) {
        index = i;
        break;
      }
    }

    let removedBook = books.splice(index, 1);

    if (books.length == 0) {
      this.bag = null;
      this.books = null;
      localStorage.removeItem('bag');
      return;
    }

    this.bag.books = books;
    let currentPrice = parseFloat(this.totalPrice);
    currentPrice -= this.convertToFloat(removedBook[0].price) * this.convertToFloat(removedBook[0].quantity);
    this.totalPrice  = currentPrice.toFixed(2);
    this.bag.price = this.totalPrice;
    this.books = books;
    localStorage.removeItem('bag');
    localStorage.setItem('bag', JSON.stringify(this.bag));
  }

  order() {
    if (this.currentUser != null) {
      this.userService.order(this.bag.books, this.currentUser._id, this.bag.price, this.currentUser.name, this.currentUser.surname,
        this.currentUser.address, this.currentUser.city, this.currentUser.phone).subscribe((o: any) => {
          if (o != null) {
            localStorage.removeItem('bag');
            this.bag = null;
            this.books = null;
            window.alert("Narudžbina uspešna!");
            this.router.navigate(['/home']);
          } else {
            window.alert("Pokušajte ponovo!");
          }
        })
    } else {
      window.alert("Morate uneti podatke o sebi!");
      this.router.navigate(['/info']);
    }
  }

}
