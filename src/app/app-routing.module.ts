import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'divelog',
    pathMatch: 'full',
    loadChildren: () => import('./features/divelog/divelog.module').then(module => module.DivelogModule)
  },
  {
    path: 'connect',
    pathMatch: 'full',
    loadChildren: () => import('./features/connect/connect.module').then(module => module.ConnectModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
