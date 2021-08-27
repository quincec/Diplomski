import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import { Book } from '../book.model';
import { Wishlist } from '../wishlist.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  type: String;
  currentUser: any;
  
  books: any;
  sortCategory: any;
  myWishlist: Wishlist[];

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser != null) {
      this.type = this.currentUser.type;
      if (this.type == "admin") {
        this.router.navigate(['/requests']);
      }
    } else {
      this.type = "guest";
    }

    this.userService.getAllBooks().subscribe((b: any) => {
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
      let priceFloat = parseFloat(this.convertToFloat(b.price)).toFixed(2);
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
