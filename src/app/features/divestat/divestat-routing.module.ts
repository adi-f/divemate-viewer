import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DivestatComponent } from './divestat.component';

const routes: Routes = [
  {
    path: '**',
    component: DivestatComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivestatRoutingModule { }
