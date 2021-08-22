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

  myWishlist: Wishlist[];
  wishlistExists: Boolean = false;

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser == null || (this.currentUser != null && this.currentUser.type == "admin")) {
        this.router.navigate(['/home']);
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

}
