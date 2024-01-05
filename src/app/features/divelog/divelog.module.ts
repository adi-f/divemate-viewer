import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import { HttpClientModule } from '@angular/common/http';
import { DivelogComponent } from './divelog.component';
import { MinutesToTimehPipe } from './minutesToTime.pipe';
import { DivelogRoutingModule } from './divestat-routing.module';

@NgModule({
  declarations: [
    DivelogComponent,
    MinutesToTimehPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DivelogRoutingModule,

    MatTableModule
  ]
})
export class DivelogModule { }
