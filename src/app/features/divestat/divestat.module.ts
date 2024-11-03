import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatTreeModule} from '@angular/material/tree';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { DivestatRoutingModule } from './divestat-routing.module';
import { DivestatComponent } from './divestat.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DivestatComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DivestatRoutingModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule
  ]
})
export class DivestatModule { }
