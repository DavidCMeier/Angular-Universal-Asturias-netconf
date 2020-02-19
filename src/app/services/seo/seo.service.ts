import {Inject, Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {environment} from '../../../environments/environment';

export interface ConfigSeo {
  title;
  description;
  index?;
  follow?;
  keywords?;
  crawlerTitle?;
  crawlerDescription?;
  crawlerImage?;
  twitterTitle?;
  twitterDescription?;
  canonical?;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title,
              private meta: Meta,
              @Inject(DOCUMENT) private doc, ) {

  }

  configSeo(config: ConfigSeo) {
    this.title.setTitle(config.title)
    const pathname = new URL(this.doc.URL).pathname;
    this.meta.updateTag({name: 'description', content: config.description});
    this.meta.updateTag({name: 'robots', content: config.index && config.follow ? config.index + ',' + config.follow : 'index,follow'});
    this.meta.updateTag({name: 'keywords', content: config.keywords});
    this.meta.updateTag({name: 'og:type', content: 'website'});
    this.meta.updateTag({name: 'og:title', content: config.crawlerTitle || config.title});
    this.meta.updateTag({name: 'og:description', content: config.crawlerDescription || config.description});
    this.meta.updateTag({name: 'og:url', content: environment.baseUrl + pathname});
    this.meta.updateTag({name: 'og:site_name', content: 'Racetick'});
    this.meta.updateTag({name: 'og:image', content: config.crawlerImage || '/assets/images/logos/logo-racetick.svg'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary'});
    this.meta.updateTag({name: 'twitter:url', content: environment.baseUrl + pathname});
    this.meta.updateTag({name: 'twitter:title', content: config.twitterTitle || config.title});
    this.meta.updateTag({name: 'twitter:description', content: config.twitterDescription || config.description});
    this.meta.updateTag({name: 'twitter:site', content: '@racetick'});

    const linkElement = this.doc.head.querySelector(`link[rel='canonical']`)
      || this.doc.head.appendChild(this.doc.createElement('link'));
    if (linkElement) {
      linkElement.setAttribute('rel', 'canonical');
      linkElement.setAttribute('href', config.canonical || this.doc.URL.split('?')[0]);
    }
  }



}
