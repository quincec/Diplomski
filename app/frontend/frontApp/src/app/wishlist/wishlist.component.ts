import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import { Book } from '../book.model';
import { Wishlist } from '../wishlist.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;

  myWishlist: Wishlist[] = [];
  wishlistExists: Boolean = false;

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser == null) {
        this.router.navigate(['/home']);
    } 
    if (this.currentUser != null && this.currentUser.type == "admin") {
      this.router.navigate(['/requests']);
    }

    this.userService.getMyWishlist(this.currentUser._id).subscribe((w: Wishlist[]) => {
      this.wishlistExists = false;
      if (w) {
        this.myWishlist = w;
        this.wishlistExists = true;
      }
    })
  }

  removeFromWishlist(w: any) {
    this.userService.removeFromWishlist(w.link, w.title, this.currentUser._id).subscribe((res: Wishlist) => {
      let list = this.myWishlist;
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id == w._id) {
          list.splice(i, 1);
        }
      }
      this.wishlistExists = false;
      this.myWishlist = list;
    })
  }

  getStringPrice(p: any): any {
    let price = p.replace(/\s+/g, '');
    return price;
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

  calculateTotalPrice(myBag, b) : any {
    let totalPriceFloat = parseFloat(myBag.price);
    let bookPriceFloat = this.convertToFloat(b.price);
    let totalPrice = 0;
    totalPrice = bookPriceFloat + totalPriceFloat;
    return myBag.price = totalPrice.toFixed(2);
  }

  addToBag(b: any) {
    let myBag = JSON.parse(localStorage.getItem('bag'));
    let pr = b.price;
    b.price = this.getStringPrice(pr);
    if (myBag != null) {
      localStorage.removeItem('bag');
      let books = myBag.books;
      for (let i = 0; i < books.length; i++) {
        if (books[i].title == b.title && books[i].link == b.link) {
          books[i].quantity += 1;
          myBag.books = books;
          let totalPrice = this.calculateTotalPrice(myBag, b);
          myBag.price = totalPrice;
          localStorage.setItem('bag', JSON.stringify(myBag));
          window.alert('Uspešno ste dodali ' + b.title + ' u korpu!');
          return;
        }
      }
      const obj = {
        title: b.title,
        link: b.link,
        price: b.price,
        quantity: 1,
        author: b.author
      };
      books.push(obj);
      let totalPrice = this.calculateTotalPrice(myBag, b);
      myBag.price = totalPrice;
    } else {
      //prva stvar se dodaje u korpu
      let priceFloat = parseFloat(this.convertToFloat(b.price));
      const bag = {
        books : [{
          title: b.title,
          link: b.link,
          price: b.price,
          quantity: 1,
          author: b.author
        }],
        price: priceFloat
      };
      myBag = bag;
    }
    localStorage.setItem('bag', JSON.stringify(myBag));
    window.alert('Uspešno ste dodali ' + b.title + ' u korpu!');
  }
}
