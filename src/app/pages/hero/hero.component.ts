import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeroesService} from '../../services/heroes.service';
import {Subscription} from 'rxjs';
import {Hero} from '../../models/hero/hero';
import {ActivatedRoute, Router} from '@angular/router';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {

  hero: Hero;
  id: number;
  subscribe: Subscription[] = [];

  constructor(public heroesService: HeroesService, private route: ActivatedRoute, private router: Router) {
    this.subscribe.push(
      this.route.params.pipe(
        flatMap((params) => {
          this.id = this.castStringToNumber(params.id);
          return this.heroesService.getHero(this.id);
        }),
      ).subscribe((hero) => {
        this.hero = hero;
      })
    );
  }

  ngOnInit(): void {
  }

  castStringToNumber(id: any): number {
    const cast = Number(id);
    if (!isNaN(cast)) { return cast; }
    this.router.navigate(['error', 500], {skipLocationChange: true});
  }

  ngOnDestroy(): void {
    this.subscribe.map((sub) => sub.unsubscribe());
  }

}
