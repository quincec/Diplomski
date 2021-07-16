import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  type: String;
  currentUser: any;

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser != null) {
      this.type = this.currentUser.type;
    } else {
      this.type = "guest";
    }
  }
}
