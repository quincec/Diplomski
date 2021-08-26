import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;
  orders: any;

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser == null || (this.currentUser != null && this.currentUser.type == "admin")) {
        this.router.navigate(['/home']);
    }

    this.userService.getMyOrders(this.currentUser._id).subscribe((o: any) => {
      if (o != null) {
        this.orders = o;
      }
    })
  }


}
