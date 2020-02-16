#Angular Universal Workshop
Bienvenidos a este taller para iniciarse en el mundo de Angular Universal. 
Para poder realizarlo deberéis de tener node 10.13 o superior.

Para realizar la instalación: 

Podéis descargaros node desde la web: https://nodejs.org/es/

(También podéis usar nvm https://github.com/nvm-sh/nvm (linux y mac) o nvm-window(https://github.com/coreybutler/nvm-windows))

Una vez instalado node instalamos Angular (al usar -g debéis de tener permisos de administrador): 
```
npm install -g @angular/cli
```

Luego debéis de hacer un install para usar este repositorio: 
```
npm install
```
# TUTORIAL

### EMPEZAMOS CON UNIVERSAL

(Esta parte es lo mismo que hace el comando 'ng add ng add @nguniversal/express-engine'. El repositorio ya tiene esta parte hecha)
1. Se instalan las dependencias necesarias: 

   - npm install @angular/platform-server
   - npm install @nguniversal/express-engine
   - npm install express
   - npm install @nguniversal/builders
   - npm install @types/express

2. Empezamos con las modificaciones primero: 

   1. Modificamos el angular.json

      ```typescript
      "architect": {
              "build": {
                "builder": "@angular-devkit/build-angular:browser",
                "options": {
                  "outputPath":
              "dist/angularUniversalWorkshop/browser"
      ```

      ```typescript
      "server": {
                "builder": "@angular-devkit/build-angular:server",
                "options": {
                  "outputPath": "dist/angularUniversalWorkshop/server",
                  "main": "server.ts",
                  "tsConfig": "tsconfig.server.json"
                },
                "configurations": {
                  "production": {
                    "outputHashing": "media",
                    "fileReplacements": [
                      {
                        "replace": "src/environments/environment.ts",
                        "with": "src/environments/environment.prod.ts"
                      }
                    ],
                    "sourceMap": false,
                    "optimization": true
                  }
                }
              },
              "serve-ssr": {
                "builder": "@nguniversal/builders:ssr-dev-server",
                "options": {
                  "browserTarget": "angularUniversalWorkshop:build",
                  "serverTarget": "angularUniversalWorkshop:server"
                },
                "configurations": {
                  "production": {
                    "browserTarget": "angularUniversalWorkshop:build:production",
                    "serverTarget": "angularUniversalWorkshop:server:production"
                  }
                }
              },
              "prerender": {
                "builder": "@nguniversal/builders:prerender",
                "options": {
                  "browserTarget": "angularUniversalWorkshop:build:production",
                  "serverTarget": "angularUniversalWorkshop:server:production",
                  "routes": [
                    "/"
                  ]
                },
                "configurations": {
                  "production": {}
                }
              }
          
      ```
   2. Modificamos el src/app/app.module.ts:
      ```
      BrowserModule.withServerTransition({ appId: 'serverApp' })
      ```
   3. Modificamos el src/app/app.routing.ts para añadir el initialNavigation:
   ```typescript
   initialNavigation: 'enabled'
   ```
   4. Modificamos el Main.ts:
   ```typescript
   document.addEventListener('DOMContentLoaded', () => {
     platformBrowserDynamic().bootstrapModule(AppModule)
     .catch(err => console.error(err));
   });
   ```
3. Creación de los ficheros: 
   1. Creamos src/app/app.server.module.ts
      ```typescript
      import { NgModule } from '@angular/core';
      import { ServerModule } from '@angular/platform-server';
      
      import { AppModule } from './app.module';
      import { AppComponent } from './app.component';
      
      @NgModule({
        imports: [
          AppModule,
          ServerModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppServerModule {}
      ```
     
   2. Creamos src/main.server.ts
      ```typescript
      import { enableProdMode } from '@angular/core';
      
      import { environment } from './environments/environment';
      
      if (environment.production) {
        enableProdMode();
      }
      
      export { AppServerModule } from './app/app.server.module';
      export { renderModule, renderModuleFactory } from '@angular/platform-server';
      
      ```
   3. Creamos el tsconfig.server.json
      ```json
      {
        "extends": "./tsconfig.app.json",
        "compilerOptions": {
          "outDir": "./out-tsc/app-server",
          "module": "commonjs",
          "types": [
            "node"
          ]
        },
        "files": [
          "src/main.server.ts",
          "server.ts"
        ],
        "angularCompilerOptions": {
          "entryModule": "./src/app/app.server.module#AppServerModule"
        }
      }
      ```
   4. Por ultimo creamos el fichero más importante, el server.ts
      ```typescript
      import 'zone.js/dist/zone-node';
      
      import {ngExpressEngine} from '@nguniversal/express-engine';
      import * as express from 'express';
      import {join} from 'path';
      
      import {AppServerModule} from './src/main.server';
      import {APP_BASE_HREF} from '@angular/common';
      import {existsSync} from 'fs';
      import {REQUEST, RESPONSE} from '@nguniversal/express-engine/tokens';
      
      // The Express app is exported so that it can be used by serverless Functions.
      export function app() {
        const server = express();
        const distFolder = join(process.cwd(), 'dist/angularUniversalWorkshop/browser');
        const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
      
        // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
        server.engine('html', ngExpressEngine({
          bootstrap: AppServerModule,
        }));
      
        server.set('view engine', 'html');
        server.set('views', distFolder);
      
        // Example Express Rest API endpoints
        // app.get('/api/**', (req, res) => { });
        // Serve static files from /browser
        server.get('*.*', express.static(distFolder, {
          maxAge: '1y'
        }));
      
        // All regular routes use the Universal engine
        server.get('*', (req, res) => {
          res.render(indexHtml, {
            req,
            providers: [
              {provide: APP_BASE_HREF, useValue: req.baseUrl},
              {provide: REQUEST, useValue: req},
              {provide: RESPONSE, useValue: res}
            ]
          });
        });
      
        return server;
      }
      
      function run() {
        const port = process.env.PORT || 4000;
      
        // Start up the Node server
        const server = app();
        server.listen(port, () => {
          console.log(`Node Express server listening on http://localhost:${port}`);
        });
      }
      
      // Webpack will replace 'require' with '__webpack_require__'
      // '__non_webpack_require__' is a proxy to Node 'require'
      // The below code is to ensure that the server is run only when not requiring the bundle.
      declare const __non_webpack_require__: NodeRequire;
      const mainModule = __non_webpack_require__.main;
      const moduleFilename = mainModule && mainModule.filename || '';
      if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
        run();
      }
      
      export * from './src/main.server';
      
      ```
4. Finalizando ya solo nos queda crear los scripts de ejecución: 
   - dentro del package.json:
   ```json
   "dev:ssr": "ng run angularUniversalWorkshop:serve-ssr",
   "serve:ssr": "node dist/angularUniversalWorkshop/server/main.js",
   "build:ssr": "ng build --prod && ng run angularUniversalWorkshop:server:production",
   "prerender": "ng run angularUniversalWorkshop:prerender"
   ```

5. BONUS: Modifiquemos el .gitignore para que git ignore la carpeta /dist

# Nuestra personalización y cosas a tener en cuenta

- Window is Not defined
  - Uso de Injector(PLATFORM_ID)
    - Vamos al src/app/app.component:
      ```typescript
        constructor() {
          console.log(window.location.href);
        }
      ```
      Iniciamos con un ng serve y en la consola veremos: 
      ```typescript
      http://localhost:4200/
      ```
      Si levantamos angular universal...
      ```
      ReferenceError: window is not defined
      ```
      Este problema es de los más comunes que nos vamos a encontrar y tiene una solución que, a priori, es sencilla: 
      ```typescript
      constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        console.log('Estamos en:', this.platformId);
          if (isPlatformBrowser(this.platformId)) {
            console.log(window.location.href);
          } else {
            console.log('Estamos en el servidor y no tenemos disponible la propiedad del navegador window');
          }
        }
      ```
      Ahora vamos al navegador, recargamos y veremos que en la consola se muestra o mismo que antes, pero... si vamos a la terminal con la que levantamos el servidor veremos el mensaje "Estamos en el servidor y no tenemos disponible la propiedad del navegador window"
    
      Aquí ahora toca hablar sobre la rehidratación.
          
      La rehidratación es un proceso en el que el servidor envía la página renderizada, luego el browser recibe el codigo que recibiría normalmente sin universal, lo renderiza y lo muestra. 
          
      Esto tiene unas pequeñas consecuencias, la primera ya la hemos arreglado: 
        
    - en src/app/app.routing.module.ts como véis ya pusimos: 
        ```typescript
        { initialNavigation: 'enabled' }
      ```
        Con esto evitamos un posible parpadeo que puede ocurrir al cargar la página (especialmente cuando la página usa LazyLoad)
        
        El resto ahora lo vemos a continuación.   

- Evitar llamadas duplicadas:
  - Uso de TransferState:
  
    Debido a la rehidratación es posible que nuestro server.ts realice unas llamadas al servidor y luego al rehidratar la página, esta realice otra vez las mismas llamadas. Esto dependiendo del número de llamadas y de donde lo tengamos alojado puede ser muy problemático. Para esto usamos TransferState.

    El uso de transfer State es muy sencillo: 

    ```typescript
    transferState.set(makeStateKey(KEY), DATA);
    transferState.get(makeStateKey(KEY), DATA);
    ```

    Con esto solo nos hace falta definir la KEY y saber que DATA le pondremos y que mejor definición de KEY que la misma URL a donde se realiza la llamada. Vamos a crear el interceptor:

    - src/app/interceptors/server-state.interceptor.ts

    ```typescript
    import {Injectable} from '@angular/core';
    import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
    import {makeStateKey, TransferState} from '@angular/platform-browser';
    import {Observable} from 'rxjs';
    import {tap} from 'rxjs/operators';
    
    @Injectable()
    export class ServerStateInterceptor implements HttpInterceptor {
    
      constructor(private transferState: TransferState) {}
    
      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap(event => {
          if (event instanceof HttpResponse) {
            this.transferState.set(makeStateKey(req.url), event.body);
          }
        }));
      }
    }
    ```

    - src/app/interceptors/browser-state.interceptor.ts

    ```typescript
    import { Injectable } from '@angular/core';
    import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
    import { TransferState, makeStateKey } from '@angular/platform-browser';
    import {Observable, of} from 'rxjs';
    
    @Injectable()
    export class BrowserStateInterceptor implements HttpInterceptor {
    
      constructor(private transferState: TransferState) { }
    
      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method !== 'GET') {
          return next.handle(req);
        }
    
        const storedResponse: string = this.transferState.get(makeStateKey(req.url), null);
    
        if (storedResponse) {
          const response = new HttpResponse({ body: storedResponse, status: 200 });
          return of(response);
        }
    
        return next.handle(req);
      }
    }
    ```

    Añadimos los interceptores a sus modulos correspondientes: 

    - src/app/app.server.module.ts

      ```
        providers: [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: ServerStateInterceptor,
            multi: true,
          },
        ],
      ```

    - src/app/app.module.ts

      ```
        providers: [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: BrowserStateInterceptor,
            multi: true,
          },
        ],
      ```

        Con esto ya lo tendremos todo listo para que no hayan llamadas innecesarias en la aplicación. 

- Rutas Absolutas:

  - Creación del interceptor de Angular Universal:
    En universal todas las rutas han de ser absolutas. Esto es así ya que tenéis que pensar que la aplicación está separada en dos partes, servidor y cliente. Si en vuestras llamadas ya las hacíais de manera absoluta, perfecto, pero si no es así (como precisamente hacemos nosotros, tenemos que arreglarlo para que la parte del servidor sepa como encontrar la dirección). Esto se hace con algo que ya hemos visto, un interceptor:

    ```typescript
    import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
    import { Inject, Injectable, Optional } from '@angular/core'
    import { REQUEST } from '@nguniversal/express-engine/tokens'
    import { Request } from 'express'
    
    
    @Injectable()
    export class UniversalInterceptor implements HttpInterceptor {
    
      constructor(
        @Optional() @Inject(REQUEST) protected request: Request,
      ) {
      }
    
      intercept(req: HttpRequest<any>, next: HttpHandler) {
        let serverReq: HttpRequest<any> = req
    
        if (this.request) {
          serverReq = serverReq.clone({setHeaders: {'accept-language': this.request.headers['accept-language']}})
          if (!req.url.startsWith('http')) {
            let newUrl = `${this.request.protocol}://${this.request.get('host')}`
            if (!req.url.startsWith('/')) {
              newUrl += '/'
            }
            newUrl += req.url.startsWith(newUrl) ? req.url.replace(newUrl, '') : req.url
            serverReq = serverReq.clone({url: newUrl})
          }
        }
        return next.handle(serverReq)
      }
    }
    
    ```

    Por supuesto esto tenemos que añadirlo al src/app/app.server.module.ts:

    ```typescript
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: UniversalInterceptor,
        multi: true
      }],
    ```

    

- Creación de un Servicio para SEO

  - Creamos un servicio con 'ng g service services/seo/seo'

  - Inyectamos en el constructor varias cosas

    ```typescript
      constructor(private title: Title,
                  private meta: Meta,
                  @Inject(DOCUMENT) private doc,
      ) {}
      ```

      Title y Meta nos viene de @angular/platform-browser y el DOCUMENT de @angular/common

  - Luego creamos una función donde modificaremos las metas según una interfaz previa:
    - Interfaz:
        ```typescript
        export interface ConfigSeo {
          title;
          description;
          index;
          follow;
          keywords;
          crawlerTitle;
          crawlerDescription;
          crawlerImage;
          twitterTitle;
          twitterDescription;
          canonical;
        }
        ```

        configSeo:

        ```typescript
        configSEO(config: ConfigSeo) {
            this.title.setTitle(config.title);
            const pathname = new URL(this.doc.URL).pathname;
            this.meta.updateTag({name: 'description', content: config.description});
            this.meta.updateTag({name: 'robots', content: (config.index + ',' + config.follow) || 'index,follow'});
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
        ```

    Estas etiquetas son de las más comunes, pero podéis crear las que creais convenientes. Importante fijarae en el Canonical, ya que es muy importante para el seo.

    Ahora lo usamos en nuestra página principal:

    Vamos al src/app/app.component.ts:

    ```typescript
       constructor(@Inject(PLATFORM_ID) private platformId: Object, public seoService: SeoService) {
       ...
        this.seoService.configSEO({
          title: 'Página de inicio',
          description: 'Esto es una descripción molona',
          keywords: 'Inicio, Heroes, ciencia, science',
        });
      }
    ```
    Por último lo añadimos también a la página individual de heroes 'src/app/pages/hero/hero.component.ts' (Justo en el momento en el que recogemos los datos):

    ```typescript
    this.seoService.configSEO({
              title: this.hero.name,
              description: this.hero.description,
              keywords: 'Inicio, Heroes, ciencia, science',
              crawlerImage: this.hero.image,
            });
    ```

- Cambiar el status Code

  - Modificamos nuestra página de error.

    - Inyectamos el PLATFORM_ID y el RESPONSE en el constructor:
        ```
          constructor(private activatedRoute: ActivatedRoute,
                      @Inject(PLATFORM_ID) private platformId: Object,
                      @Optional() @Inject(RESPONSE) private response: Response,
          ) {}
        ```
        Creamos una variable para exportar el Error: 
        ```
        ErrorSatus = ErrorStatus;
        ```
        Creamos una función para comprobar el ID y evitar enviar algo que no sirva al servidor:
        ```
          checkError(id: number): ErrorStatus {
            if (isNaN(id)) {
              return ErrorStatus.INTERNAL_SERVER_ERROR;
            }
            const val = ErrorStatus[id];
            return val ? ErrorStatus[val] : ErrorStatus.INTERNAL_SERVER_ERROR;
          }
        ```  
        Luego le añadimos esto a la llamada que comprueba el ID:  
        ```
            this.subscribe.push(this.route.params.subscribe((params) => {
              const idNumber = Number(params.id);
              this.id = this.checkError(idNumber);
              if (isPlatformServer(this.platformId)) {
                this.response.status(this.id);
              }
            }));
        ```
    
    #RETO
    En este momento os pido que dejéis de leer si no habéis realizado el taller e intentéis resolver este pequeño reto.
    La idea es que si no existe el elemento que buscamos, vayamos a la página de error con un 404. 
    .
    
    .
    
    .
    
    .
    
    .
    Muy bien, vamos a resolverlo (en el fichero de reto.md)
    
    #RETO 2
    Si intentáis ahora mismo hacer un ng serve, veréis que no funciona. Esto es debido a que el initial navigation del app.routing esta como 'enabled'. Veamos como lo resolvéis.
    



























