import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;

  oldPassword: String;
  newPassword: String;
  newPasswordRepeated: String;

  messageOldPassword: String;
  messageNewPassword: String;
  messageNewPasswordRepeated: String;

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser != null && this.currentUser.type == "admin") {
        this.router.navigate(['/home']);
    }
  }

  changePassword() {

  }
}
