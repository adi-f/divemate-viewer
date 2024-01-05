import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectComponent } from './connect/connect.component';
import { SignInRoutingModule } from './connect-routing.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ConnectComponent
  ],
  imports: [
    CommonModule,

    SignInRoutingModule,

    MatButtonModule
  ]
})
export class ConnectModule { }
