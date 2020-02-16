import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeroesComponent} from './heroes.component';
import {MatCardModule} from '@angular/material/card';
import {RouterModule, Routes} from '@angular/router';
import {MatListModule} from '@angular/material/list';

const routes: Routes = [
  {path: '', component: HeroesComponent}
];

@NgModule({
  declarations: [HeroesComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatCardModule,
    MatListModule
  ]
})
export class HeroesModule {
}
