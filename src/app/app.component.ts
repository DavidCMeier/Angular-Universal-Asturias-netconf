import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {SeoService} from './services/seo/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angularUniversalWorkshop';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public seoService: SeoService) {
    console.log(this.platformId);
    if (isPlatformBrowser(this.platformId)) {
      console.log(window.location.href);
    } else {
      console.log('NO ESTAMOS EN EL BROWSER');
    }
    const config = {
      title: 'Página principal',
      description: 'Esta es una descripción molona',
      keywords: 'Clave',
    };
    this.seoService.configSeo(config);
  }
}
