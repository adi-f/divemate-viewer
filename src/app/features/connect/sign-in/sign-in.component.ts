import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GoogleService, LoginState } from '../google/google.service';

@Component({
  selector: 'dv-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  loginState$: Subject<LoginState>;

  constructor(private googleService: GoogleService) {
    this.loginState$ = this.googleService.loginState$;
   }

  ngOnInit(): void {
    this.googleService.setup();
  }

  login(): void {
    this.googleService.login();
  }

  async readDb() {
    console.log(await this.googleService.readDiveMateDb());
  }
}
