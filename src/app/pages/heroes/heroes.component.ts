import {Component, OnInit} from '@angular/core';
import {HeroesService} from '../../services/heroes.service';
import {Hero} from '../../models/hero/hero';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  heroes: Observable<Hero[]>;

  constructor(public heroesService: HeroesService) {
  }

  ngOnInit(): void {
    this.heroes = this.getList();
  }

  getList() {
    return this.heroesService.getListHeroes();
  }

}
