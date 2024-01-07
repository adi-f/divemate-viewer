import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { DivestatRoutingModule } from './divestat-routing.module';
import { DivestatComponent } from './divestat.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

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
    MatButtonModule
  ]
})
export class DivestatModule { }
