import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import { Book } from '../book.model';
import { Wishlist } from '../wishlist.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  type: String;
  currentUser: any;
  keyword: String;
  
  books: any = [];
  sortCategory: any;
  myWishlist: Wishlist[];

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    this.keyword = localStorage.getItem('keyword');
    if (this.currentUser != null) {
      this.type = this.currentUser.type;
    } else {
      this.type = "guest";
    }

    this.userService.searchBooks(this.keyword).subscribe((b: any) => {
      this.books = b;
      if (this.type == 'user') {
        this.userService.getMyWishlist(this.currentUser._id).subscribe((w: Wishlist[]) => {
          if (w) {
            this.myWishlist = w;
            for (let i = 0; i < b.length; i++) {
              for (let j = 0; j < w.length; j++) {
                if (b[i].title == w[j].title && b[i].link == w[j].link) {
                  b[i].wishlist = true;
                  break;
                }
                if (b[i].wishlist != true) {
                  b[i].wishlist = false;
                }
              }
            }
            this.books = b;
          }
        })
      }
    })
  }

  sort() {
    if (this.sortCategory == "titleAsc") {
      this.books.sort(function(b1, b2) {
        if (b1.title < b2.title) {
          return -1;
        }
        if (b1.title > b2.title) {
          return 1;
        }
        return 0;
      });
    }
    if (this.sortCategory == "titleDesc") {
      this.books.sort(function(b1, b2) {
        if (b1.title > b2.title) {
          return -1;
        }
        if (b1.title < b2.title) {
          return 1;
        }
        return 0;
      });
    }
  }

  addToWishlist(b: any) {
    this.userService.addToWishlist(b._id, b.author, b.bookstore, b.imgSrc, b.link, b.price, b.title, this.currentUser._id).subscribe((res: Wishlist) => {
      let books = this.books;
      for (let i = 0; i < books.length; i++) {
        if (books[i]._id == b._id) {
          books[i].wishlist = true;
        }
      }
      this.books = books;
    })
  }

  removeFromWishlist(b: any) {
    this.userService.removeFromWishlist(b.link, b.title, this.currentUser._id).subscribe((res: Wishlist) => {
      let books = this.books;
      for (let i = 0; i < books.length; i++) {
        if (books[i]._id == b._id) {
          books[i].wishlist = false;
        }
      }
      this.books = books;
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
