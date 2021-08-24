import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit {


  constructor(private router: Router) { }

  currentUser: any;

  searchBy: string;

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/starting-page']);
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
