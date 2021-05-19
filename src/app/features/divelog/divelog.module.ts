import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivelogComponent } from './divelog/divelog.component';
import { DivelogRoutingModule } from './divelog-routing.module';
import {MatTableModule} from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    DivelogComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DivelogRoutingModule,

    MatTableModule
  ]
})
export class DivelogModule { }
