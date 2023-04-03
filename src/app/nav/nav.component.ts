import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { LoginUser } from '../model/loginUser';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  router: any;

  constructor(private authService:AuthService,private formBuilder: FormBuilder, private alertifyService: AlertifyService) { }

loginUser!: LoginUser;
loginForm!: FormGroup;

createForm() {
  this.loginForm = this.formBuilder.group(
    {
      email: ["", Validators.required],
      password: ["", Validators.required]
    }
  );
}

ngOnInit(): void {
  this.createForm();
}

  login(){
   this.loginUser= new LoginUser;
   this.loginUser.email=(document.getElementById("email") as HTMLInputElement).value;
   this.loginUser.password=(document.getElementById("password") as HTMLInputElement).value;
this.authService.login(this.loginUser);
  }

    logOut(){
      this.alertifyService.error("You have logged out of the application!");
      this.authService.logOut();
    }

     get isAuthenticated(){
      return this.authService.loggedIn();
     }

}
