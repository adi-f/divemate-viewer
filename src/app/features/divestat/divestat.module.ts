import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { DivestatRoutingModule } from './divestat-routing.module';
import { DivestatComponent } from './divestat.component';

@NgModule({
  declarations: [
    DivestatComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DivestatRoutingModule,

    MatTableModule,
    MatButtonModule
  ]
})
export class DivestatModule { }
