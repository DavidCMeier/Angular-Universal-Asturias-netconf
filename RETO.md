#RETO

Vamos a resolver el reto que hemos comentado:

La idea es que cuando llamemos para cargar una heroina si esta no existe, te lleve a la página de error con un 404.

Creamos un resolver:
- src/app/resolvers/hero.resolver.ts
    ````typescript
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
    ````
  
 - Luego vamos al archivo src/app/pages/hero.component.ts:
    
    Quitamos la inyección al heroService porque ya no la usaremos, en su lugar importamos 'ActivatedRoute'
    
    Comprobamos si existe el dato del resolver, si no es así enviamos a la página de error.
     ````typescript
        this.hero = route.snapshot.data.hero;
        if (!this.hero) {
          this.router.navigate(['error', '404'], {skipLocationChange: true});
        }
    ````
    Fijáos que hemos añadido al navigate '{skypLocationChange: true}' de esta manera no cambiaremos la URL.
