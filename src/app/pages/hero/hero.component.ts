import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Hero} from '../../models/hero/hero';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigSeo, SeoService} from '../../services/seo/seo.service';
import {isPlatformServer} from '@angular/common';

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
              private seoService: SeoService,
  ) {

    this.hero = this.route.snapshot.data.hero;
    if (!this.hero) {
        this.router.navigate(['error', 404], {skipLocationChange: true});
        return;
    }

    const config: ConfigSeo = {
      title: this.hero.name,
      description: this.hero.description,
      keywords: 'Heores idshflasdf',
      crawlerImage: this.hero.image,
      crawlerDescription: this.hero.alt
    };
    this.seoService.configSeo(config);

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
