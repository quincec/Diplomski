import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import { User } from '../user.model';

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
    if (this.currentUser == null) {
      this.router.navigate(['/home']);
    } 
    if (this.currentUser != null && this.currentUser.type == "admin") {
      this.router.navigate(['/requests']);
    }
  }

  checkIfPasswordContainsNumber(password): any{
    let regexp = /\d/
    return regexp.test(password);
 }

 checkIfPasswordContainsUpperCaseLetter(password): any{
   let regexp = /[A-Z]/;
   return regexp.test(password);
 }

 checkPassword(password): String{
   let result = "";

   if (password.length < 8) {
     result = "Lozinka mora da ima najmanje 8 karaktera!";
     return result;
   }
   if (!this.checkIfPasswordContainsNumber(password)) {
     result = "Lozinka mora da sadrži bar jednu cifru!";
     return result;
   }
   if (!this.checkIfPasswordContainsUpperCaseLetter(password)) {
     result = "Lozinka mora da sadrži bar jedno veliko slovo!";
     return result; 
   }

   return result;
 }

  changePassword() {
    this.messageOldPassword = ""; this.messageNewPassword = ""; this.messageNewPasswordRepeated = "";

    if (this.oldPassword == null || this.oldPassword == "") {
      this.messageOldPassword = "Niste uneli staru lozinku!";
    }
    if (this.newPassword == null || this.newPassword == "") {
      this.messageNewPassword = "Niste uneli novu lozinku!";
    }
    if (this.newPasswordRepeated == null || this.newPasswordRepeated == "") {
      this.messageNewPasswordRepeated = "Niste ponovili novu lozinku!";
    }
    if (this.currentUser.password != this.oldPassword) {
      this.messageOldPassword = "Uneta lozinka nije ispravna!";
    }
    if (this.newPassword.length != this.newPasswordRepeated.length || this.newPassword != this.newPasswordRepeated) {
      this.messageNewPasswordRepeated = "Nova i ponovljena lozinka moraju biti iste!"
    }

    //provera da li je lozinka odgovarajuceg oblika
    let resultCheck = this.checkPassword(this.newPassword);
    if (resultCheck != ""){
      //lozinka nije odgovarajuceg oblika
      this.messageNewPassword = resultCheck;
    }
    
    if (this.currentUser.password == this.newPassword) {
      this.messageNewPassword = "Nova i stara lozinka moraju da se razlikuju!";
    }

    if (this.messageOldPassword != "" || this.messageNewPassword != "" || this.messageNewPasswordRepeated != "") {
      return;
    }

    this.userService.changePassword(this.currentUser.username, this.newPassword).subscribe((u: User) =>{
      window.alert("Lozinka je uspešno promenjena!");
      this.currentUser = u;
      localStorage.removeItem('korisnik');
      localStorage.setItem('korisnik', JSON.stringify(this.currentUser));
      this.router.navigate(['/home']);
    })

  }
}
