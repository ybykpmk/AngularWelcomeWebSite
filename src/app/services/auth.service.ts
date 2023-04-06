import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { LoginUser } from '../model/loginUser';
import { LoginResponse } from '../model/loginResponse';
import { Router } from '@angular/router';
import { AlertifyService } from './alertify.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Greeting } from '../model/greeting';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}
  path = 'http://66.70.229.82:8181/Authorize';
  userToken: any;
  decodedToken: any;
  TOKEN_KEY = 'Token';

  login(loginUser: LoginUser) {
    let headers = new HttpHeaders({});
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append(
      'Access-Control-Allow-Methods',
      'OPTIONS, DELETE, POST, GET, PATCH, PUT'
    );
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    );

    this.httpClient
      .post<LoginResponse>(this.path, loginUser, { headers: headers })
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.error instanceof ErrorEvent) {
              this.alertifyService.error('Error Event');
            } else {
              switch (err.status) {
                case 401:
                  this.alertifyService.error('You are not authorized');
                  //this.router.navigateByUrl("value");
                  break;
                case 200:
                  this.alertifyService.success(
                    'You are an authorized user and logged into the system'
                  );
                  this.saveToken(err.error.text);
                  this.userToken = err.error.text;
                  this.router.navigateByUrl('home');
                  break;
              }
            }
          } else {
            alert('An unknown error occurred!');
          }
          alert('Error Event');
          return throwError(err);
        })
      )
      .subscribe((response: LoginResponse) => {
        if (response.status == 1) {
          this.alertifyService.error('You are not authorized');
          console.log(response);
          this.router.navigateByUrl('loginPage');
        } else if (response.status == 0) {
          console.log(response);
          this.alertifyService.success(
            'You are an authorized user and logged into the system'
          );
          this.saveToken(response.data.token);
          this.connectServerViaWs();
          this.router.navigateByUrl('home');
        }
      });
  }

  connectServerViaWs() {
    var userToken = localStorage.getItem(this.TOKEN_KEY)!.toString();
    const myWebSocket = new WebSocket('ws://66.70.229.82:8181/?' + userToken);
    
    myWebSocket.addEventListener("message",(event)=>{
      console.log("websocket event listener added");
      this.alertifyService.success(`received messages from web service are : " ${JSON.parse(event.data).MessageType} + " - " +${JSON.parse(event.data).TimeStamp} `);
      console.log(`received messages from web service are : " ${JSON.parse(event.data).TimeStamp}`);
      console.log(`received messages from web service are : " ${JSON.parse(event.data).MessageType}`);
    })  
    
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigateByUrl('loginPage');
  }

  loggedIn() {
    if (localStorage.getItem(this.TOKEN_KEY) != null) {
      return true;
    } else {
      return false;
    }
  }

  getGreeting() {
    var userToken = localStorage.getItem(this.TOKEN_KEY)!.toString();
    const headers = {
      'x-user-token': userToken,
    };
    return this.httpClient.get<Greeting>(
      'http://66.70.229.82:8181/GetGreeting',
      { headers: headers }
    );
  }
}
