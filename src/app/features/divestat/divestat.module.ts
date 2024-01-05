import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import { HttpClientModule } from '@angular/common/http';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
