import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-starting-page',
  templateUrl: './starting-page.component.html',
  styleUrls: ['./starting-page.component.css']
})
export class StartingPageComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;

  username: String;
  password: String;

  messageUsername: String;
  messagePassword: String;

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser != null) {
        this.router.navigate(['/home']);
    }
  }

  login(){
    this.messagePassword = "";
    this.messageUsername = "";
    if (this.username == null || this.username == "") {
      this.messageUsername = "Niste uneli korisničko ime!";
    }
    if (this.password == null || this.password == "") {
      this.messagePassword = "Niste uneli lozinku!";
    }

    //ako je nesto sigurno uneto u polja za korisnicko ime i lozinku
    if (this.messagePassword == "" && this.messageUsername == "") {
      this.userService.getUserByUsernamePassword(this.username, this.password).subscribe((response : any) => {
        if (response.messageUsername) {
          //ako je bilo nekih problema prilikom prijavljivanja zbog korisnickog imena
          this.messageUsername = response.messageUsername;
          return;
        }
        if (response.messagePassword){
          //ako je bilo nekih problema prilikom prijavljivanja zbog lozinke
          this.messagePassword = response.messagePassword;
          return;
        }
        //sigurno postoji odgovarajuci korisnik
        localStorage.setItem('korisnik', JSON.stringify(response));
        this.router.navigate(['/home']);
      });
    }
  }

}
