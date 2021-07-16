import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit {

  constructor(private router: Router) { }

  user: any;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('korisnik'));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/starting-page']);
  }

  search() {
    
  }

}
