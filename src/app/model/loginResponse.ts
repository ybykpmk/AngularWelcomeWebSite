import {LoginData} from "./loginData";

export class LoginResponse{
    data!:LoginData;
    error!:string;
    status!: number;
}