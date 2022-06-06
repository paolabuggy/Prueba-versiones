import { Component, OnInit } from '@angular/core';
import { WindowService } from '../../window.service';
import { Router } from '@angular/router';

import firebase from "firebase/compat/app";
import 'firebase/compat/auth'; 
import 'firebase/compat/firestore';

export class PhoneNumber{
  country: string = "";
  area: string = "";
  prefix: string = "";
  line: string = "";

  //Format phone numbers as E.164
  get e164(){
    const num = this.country + this.area + this.prefix + this.line;
    return `+${num}`;
  }

}

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css']
})
export class PhoneLoginComponent implements OnInit {
  windowRef: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string = "";
  user: any;

  constructor(private win: WindowService, public router: Router) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
    .then((result: any) => {
      this.windowRef.confirmationResult = result;
    }).catch( (error: any) => console.log(error) );
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult.confirm(this.verificationCode)
    .then( (result: any) => {
      this.user = result.user;
    }).catch( (error: any) => {
      console.log(error, "Código incorrecto");
      alert("Código incorrecto");
    });
  }

  logOut(){
    firebase.auth().signOut().then(() => {
      this.router.navigate(['menu']);
    }).catch( (error: any) => console.log(error) );
  }

  
}
