import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import {HeroesService} from '../services/heroes.service';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class HeroResolver implements Resolve<Observable<any>> {

  constructor(private heroesService: HeroesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.heroesService.getHero(route.params.id).pipe(catchError(() => of(null)));
  }

}
