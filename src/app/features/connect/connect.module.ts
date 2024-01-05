import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectComponent } from './connect/connect.component';
import { SignInRoutingModule } from './connect-routing.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    ConnectComponent
  ],
  imports: [
    CommonModule,
    OAuthModule.forRoot(),
    SignInRoutingModule,

    MatButtonModule
  ]
})
export class ConnectModule { }
