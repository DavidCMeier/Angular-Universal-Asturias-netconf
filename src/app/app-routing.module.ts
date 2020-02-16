import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'heroes', loadChildren: () => import('./pages/heroes/heroes.module').then(m => m.HeroesModule)},
  {path: 'heroes/:id', loadChildren: () => import('./pages/hero/hero.module').then(m => m.HeroModule)},
  {path: 'error/:id', loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
