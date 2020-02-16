import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeroComponent} from './hero.component';
import {RouterModule, Routes} from '@angular/router';
import {MatCardModule} from '@angular/material/card';

const routes: Routes = [
  {path: '', component: HeroComponent}
];

@NgModule({
  declarations: [HeroComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatCardModule
  ]
})
export class HeroModule {
}
