import { HomeComponent } from "../app/home/home.component";
import { LoginPageComponent } from "../app/login-page/login-page.component";
import {Routes} from "@angular/router";
export const appRoutes: Routes = [
    { path: "loginPage", component: LoginPageComponent },
    { path: "home", component: HomeComponent },
    { path: "**", redirectTo: "home", pathMatch: "full" }
];