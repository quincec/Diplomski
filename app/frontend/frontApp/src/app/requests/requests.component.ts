import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import { Request } from '../request.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor(private router: Router, private userService: UsersService) { }

  currentUser: any;

  flagRequestsExist: Boolean;
  requests: Request[];

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('korisnik'));
    if (this.currentUser == null || (this.currentUser != null && this.currentUser.type == "user")) {
        this.router.navigate(['/home']);
    }
    this.userService.getAllRequests().subscribe((r : Request[]) => {
      this.requests = r;
      this.flagRequestsExist = (this.requests.length != 0);
    })
  }

  acceptRequest(_id: any) {
    this.userService.acceptRequest(_id).subscribe((r : Request) => {
      let emailBody = "prihvaćen";
      this.userService.sendMailConfirmation(r.email, emailBody).subscribe((u : any) => {
        this.userService.getAllRequests().subscribe((req : Request[]) => {
          this.requests = req;
          this.flagRequestsExist = (this.requests.length != 0);
        })
      })
    })
  }

  denyRequest(_id: any) {
    this.userService.denyRequest(_id).subscribe((r : Request) => {
      let emailBody = "odbijen";
      this.userService.sendMailConfirmation(r.email, emailBody).subscribe((u : any) => {
        this.userService.getAllRequests().subscribe((req : Request[]) => {
          this.requests = req;
          this.flagRequestsExist = (this.requests.length != 0);
        })
      })
    })
  }

}
