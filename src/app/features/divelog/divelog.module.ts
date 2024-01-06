import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { DivelogComponent } from './divelog.component';
import { MinutesToTimehPipe } from './minutesToTime.pipe';
import { DivelogRoutingModule } from './divestat-routing.module';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    DivelogComponent,
    MinutesToTimehPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DivelogRoutingModule,
    MatSortModule,
    MatTableModule
  ]
})
export class DivelogModule { }
