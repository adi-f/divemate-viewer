import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DivelogComponent } from './divelog/divelog.component';

const routes: Routes = [
  {
    path: '**',
    component: DivelogComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivelogRoutingModule { }
