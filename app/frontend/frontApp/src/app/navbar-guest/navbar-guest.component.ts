import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-guest',
  templateUrl: './navbar-guest.component.html',
  styleUrls: ['./navbar-guest.component.css']
})
export class NavbarGuestComponent implements OnInit {

  constructor(private router: Router) { }

  searchBy: string;

  ngOnInit(): void {
  }

  search() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
  }
  this.router.onSameUrlNavigation = 'reload';
  localStorage.removeItem('keyword');
  localStorage.setItem('keyword', this.searchBy);
  this.router.navigate(['/search'], { queryParams: { index: 1 } });
  }
}
