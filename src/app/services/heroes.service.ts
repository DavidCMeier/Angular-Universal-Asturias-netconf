import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Hero} from '../models/hero/hero';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  constructor(private http: HttpClient) {
  }

  getListHeroes() {
    return this.http.get<Hero[]>('./assets/mock/heroes/getListHeroes.json');
  }

  getHero(id: number) {
    return this.http.get<Hero>(`./assets/mock/hero/hero-${id}.json`);
  }
}
