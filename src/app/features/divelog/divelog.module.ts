import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivelogComponent } from './divelog/divelog.component';
import { DivelogRoutingModule } from './divelog-routing.module';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    DivelogComponent
  ],
  imports: [
    CommonModule,
    DivelogRoutingModule,

    MatTableModule
  ]
})
export class DivelogModule { }
