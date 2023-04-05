import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Greeting } from '../model/greeting';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private authService:AuthService,private httpClient:HttpClient,private router: Router ) { }
  greeting:Greeting=new Greeting;
  ngOnInit(): void {
    if (!this.authService.loggedIn()) {
      this.router.navigateByUrl('loginPage');
    }
    else
    {
      this.getGreeting().subscribe((resultgreeting)=>{
        this.greeting=resultgreeting;
         console.log("data : "+this.greeting.data);
         console.log("status : "+this.greeting.status);
         console.log("error : "+this.greeting.error);
      });
    
    }
  }
  
  getGreeting(){
    return this.authService.getGreeting();
  }

  get isAuthenticated(){
    return this.authService.loggedIn();
   }

}
