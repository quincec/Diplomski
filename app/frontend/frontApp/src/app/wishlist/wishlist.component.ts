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

  calculateTotalPrice(myBag, b) : any {
    let totalPrice = myBag.price;
    if (totalPrice.includes(".")) {
      let temp = totalPrice.split(".");
      totalPrice = "";
      for (let j = 0; j < temp.length; j++) {
        totalPrice += temp[j];
      }
    }
    totalPrice.replace(",", ".");

    if (b.price.includes(".")) {
      let temp = b.price.split(".");
      b.price = "";
      for (let j = 0; j < temp.length; j++) {
        b.price += temp[j];
      }
    }
    b.price.replace(",", ".");
    let totPrice = 0;
    totPrice += parseFloat(b.price) + parseFloat(totalPrice);
    return myBag.price = totPrice.toString();
  }

  addToBag(b: any) {
    let myBag = JSON.parse(localStorage.getItem('bag'));
    if (myBag != null) {
      localStorage.removeItem('myBag');
      let books = myBag.books;
      for (let i = 0; i < books.length; i++) {
        if (books[i].title == b.title && books[i].link == b.link) {
          books[i].quantity += 1;
          myBag.books = books;
          let totalPrice = this.calculateTotalPrice(myBag, b);
          myBag.price = totalPrice;
          localStorage.setItem('bag', JSON.stringify(myBag));
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
      const bag = {
        books : [{
          title: b.title,
          link: b.link,
          price: b.price,
          quantity: 1,
          author: b.author
        }],
        price: b.price
      };
      myBag = bag;
    }
    localStorage.setItem('bag', JSON.stringify(myBag));
    window.alert('Uspešno ste dodali ' + b.title + ' u korpu!');
  }

}
