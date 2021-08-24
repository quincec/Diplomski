import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getUserByUsernamePassword(username, password) {
    const data = {
      username: username,
      password: password
    };
    return this.http.post(`${this.uri}/getUserByUsernamePassword`, data);
  }

  areUsernameAndEmailUnique(username, email) {
    const data = {
      username: username,
      email: email
    };
    return this.http.post(`${this.uri}/areUsernameAndEmailUnique`, data);
  }

  createNewRequest(name, surname, username, password, phone, email, address, city) {
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

  saveProfileChanges(username, name, surname, phone, address, city) {
    const data = {
      username: username,
      name: name,
      surname: surname,
      phone: phone,
      address: address,
      city: city
    };
    return this.http.post(`${this.uri}/saveProfileChanges`, data);
  }

  changePassword(username, password) {
    const data = {
      username: username,
      password: password
    };
    return this.http.post(`${this.uri}/changePassword`, data);
  }

  sendMailConfirmation(emailToSend, emailBody) {
    const data = {
      email: emailToSend,
      emailBody: emailBody
    };
    return this.http.post(`${this.uri}/sendMailConfirmation`, data);
  }

  getAllRequests() {
    return this.http.get(`${this.uri}/getAllRequests`);
  }

  acceptRequest(_id) {
    const data = {
      _id: _id
    };
    return this.http.post(`${this.uri}/acceptRequest`, data);
  }

  denyRequest(_id) {
    const data = {
      _id: _id
    };
    return this.http.post(`${this.uri}/denyRequest`, data);
  }

  getAllBooks() {
    return this.http.get(`${this.uri}/getAllBooks`);
  }

  addToWishlist(bookId, author, bookstore, imgSrc, link, price, title, userId) {
    const data = {
      bookId: bookId,
      userId: userId, 
      author: author,
      bookstore: bookstore,
      imgSrc: imgSrc,
      link: link,
      price: price,
      title: title
    };
    return this.http.post(`${this.uri}/addToWishlist`, data);
  }

  removeFromWishlist(link, title, userId) {
    const data = {
      userId: userId, 
      link: link,
      title: title
    };
    return this.http.post(`${this.uri}/removeFromWishlist`, data);
  }

  getMyWishlist(userId): any {
    return this.http.get(`${this.uri}/getMyWishlist/${userId}`);
  }

  searchBooks(keyword): any {
    return this.http.get(`${this.uri}/searchBooks/${keyword}`);
  }

  order(books, userId, price, name, surname, address, city, phone) {
    const data = {
      books: books,
      userId: userId, 
      price: price,
      name: name,
      surname: surname,
      address: address,
      city: city,
      phone: phone
    };
    return this.http.post(`${this.uri}/order`, data);
  }
}
