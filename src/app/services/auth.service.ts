import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { LoginUser } from '../model/loginUser';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AlertifyService } from './alertify.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router, private alertifyService: AlertifyService) { }
  path = "http://66.70.229.82:8181/Authorize";
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelper = new JwtHelper();
  TOKEN_KEY = "Token";
 
  login(loginUser: LoginUser) {
  
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
   
    this.httpClient.post<string>(this.path + "Login", loginUser, { headers: headers })      
      .pipe(catchError((err) => {
       if (err instanceof HttpErrorResponse) {
          if (err.error instanceof ErrorEvent) {
            alert("Error Event");
            this.alertifyService.error("Error Event");
          } else {
            switch (err.status) {
              case 401:      
                this.alertifyService.error("Yetkiniz yok.");
                this.router.navigateByUrl("value");
                break;
              case 200:     
                this.alertifyService.success("Yetkili kullanıcısınız, sisteme giriş yaptınız.");
                this.saveToken(err.error.text);                  
                this.userToken = err.error.text;
                this.decodedToken = this.jwtHelper.decodeToken(err.error.text);
                this.router.navigateByUrl("city");                
                break;
            }
          }
        } else {
          alert("Bilinmeyen bir hata oluştu.");
        }
       return throwError(err);}))
      .subscribe()
  }
  
  saveToken(token: string) {
     localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  loggedIn() {
       return tokenNotExpired(this.TOKEN_KEY);
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // getCurrentUserId() {
  //   return this.jwtHelper.decodeToken(localStorage.getItem(this.TOKEN_KEY)).nameid;
  // }

}

