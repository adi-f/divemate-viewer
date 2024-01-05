import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginState } from '../google/google.service';
import { ConnectService } from './connect.service';

const LOGIN_STATES_PRETTY = {
  [LoginState.UNKNOWN]: 'unknown',
  [LoginState.LOGGED_OUT]: 'logged out',
  [LoginState.LOGGED_IN]: 'logged in',
};

@Component({
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {

  loginState$: Observable<LoginState>;
  loginStatePretty$: Observable<string>;


  constructor(private connectService: ConnectService) {
    this.loginState$ = this.connectService.loginState$;
    this.loginStatePretty$ = this.connectService.loginState$.pipe(map(state => LOGIN_STATES_PRETTY[state]));
   }

  ngOnInit(): void {
    this.connectService.setup();
  }

  login(): void {
    this.connectService.login();
  }

  readDb(): void {
    this.connectService.copyDiveLogDbToLocalCache();
  }

  clearCachedDb(): void {
    this.connectService.deleteDiveLogInLocalCache();
  }
}
