import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getUserByUsernamePassword(username, password){
    const data = {
      username: username,
      password: password
    };
    return this.http.post(`${this.uri}/getUserByUsernamePassword`, data);
  }

  areUsernameAndEmailUnique(username, email){
    const data = {
      username: username,
      email: email
    };
    return this.http.post(`${this.uri}/areUsernameAndEmailUnique`, data);
  }

  createNewRequest(name, surname, username, password, phone, email, address, city){
    const data = {
      name: name,
      surname: surname,
      username: username,
      password: password,
      email: email,
      phone: phone,
      address: address,
      city: city
    };
    return this.http.post(`${this.uri}/createNewRequest`, data);
  }
}
