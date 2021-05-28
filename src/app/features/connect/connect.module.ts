import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignInRoutingModule } from './connect-routing.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    OAuthModule.forRoot(),
    SignInRoutingModule,

    MatButtonModule
  ]
})
export class ConnectModule { }
