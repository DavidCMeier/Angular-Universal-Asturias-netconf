import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {HeroesService} from '../../services/heroes.service';
import {Subscription} from 'rxjs';
import {Hero} from '../../models/hero/hero';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigSeo, SeoService} from '../../services/seo/seo.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {

  hero: Hero;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              @Inject(PLATFORM_ID) private plaformID: Object,
  ) {

    this.hero = this.route.snapshot.data.hero;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
