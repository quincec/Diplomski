import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import { User } from '../user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;
  
  name: String;
  surname: String;
  username: String;
  password: String;
  address: String;
  city: String;
  phone: String;
  email: String;

  messageName: String = '';
  messageSurname: String = '';
  messageUsername: String = '';
  messagePassword: String = '';
  messageAddress: String = '';
  messageCity: String = '';
  messagePhone: String = '';
  messageEmail: String = '';

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser != null) {
        this.router.navigate(['/home']);
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

  checkEmail(email): any{
    let regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexp.test(email);
  }

  checkPhone(phone): any{
    let regexp = /^(\d{3})\/(\d{3})\-(\d{3,4})$/;
    return regexp.test(phone);
  }

  register(){
    //setujem sve poruke na ""
    this.messageName = ""; this.messageSurname = ""; this.messageUsername = ""; this.messagePassword = "";
    this.messageAddress = ""; this.messageCity = ""; this.messagePhone = ""; this.messageEmail = "";

    //provera da li su sva polja popunjena
    if (this.name == null || this.name == "") {
      this.messageName = "Niste uneli ime!";
    }
    if (this.surname == null || this.surname == "") {
      this.messageSurname = "Niste uneli prezime!";
    }
    if (this.username == null || this.username == "") {
      this.messageUsername = "Niste uneli korisničko ime!";
    }
    if (this.password == null || this.password == "") {
      this.messagePassword = "Niste uneli lozinku!";
    }
    if (this.address == null || this.address == "") {
      this.messageAddress = "Niste uneli adresu!";
    }
    if (this.city == null || this.city == "") {
      this.messageCity = "Niste uneli grad!";
    }
    if (this.phone == null || this.phone == "") {
      this.messagePhone = "Niste uneli telefon!";
    }
    if (this.email == null || this.email == "") {
      this.messageEmail = "Niste uneli e-mail!";
    }

    if (this.messageUsername != "" || this.messageSurname != "" || this.messagePhone != "" || this.messagePassword != "" ||
        this.messageName != "" || this.messageEmail != "" || this.messageCity != "" || this.messageAddress != "") return;

    //provera da li je korisnicko ime i e-mail jedinstveni u sistemu
    this.userService.areUsernameAndEmailUnique(this.username, this.email).subscribe((response: any) => {
      if (response){
        this.messageUsername = response.messageUsername;
        this.messageEmail = response.messageEmail;
      }

      //TODO: provera da li je email vec u uppotrebi
        
      //provera da li je lozinka odgovarajuceg oblika
      let resultCheck = this.checkPassword(this.password);
      if (resultCheck != ""){
        //lozinka nije odgovarajuceg oblika
        this.messagePassword = resultCheck;
      }

      //provera formata e-maila
      if (!this.checkEmail(this.email)){
        this.messageEmail = "E-mail nije odgovarajućeg formata!";
      }

      //provera formata kontakt telefona
      if (!this.checkPhone(this.phone)){
        this.messagePhone = "Telefon mora da bude formata xxx/xxx-xxx{x}!";
      }

      if (this.messageUsername != "" || this.messageSurname != "" || this.messagePhone != "" || this.messagePassword != "" ||
        this.messageName != "" || this.messageEmail != "" || this.messageCity != "" || this.messageAddress != "") return;

      //napravi novi zahtev za registraciju
      this.userService.createNewRequest(this.name, this.surname, this.username, this.password, this.phone, this.email, this.address, this.city).subscribe((u : User) => {
        window.alert("Vaš zahtev je uspešno poslat!");
        this.router.navigate(['/home']);
      })
    })
  }

}
