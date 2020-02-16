#RETO 2

En este pequeño reto tenemos que intentar que cuando hagamos un ng serve la aplicación funcione y si lo iniciamos con Universal que tenga el initialNavigation activado.

La solución que propongo es la siguiente: 

```typescript
export class AppRoutingModule {

  constructor(@Inject(ROUTER_CONFIGURATION) config: ExtraOptions, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      config.initialNavigation = 'enabled';
    }
  }
}
```

Como podéis ver en el AppRoutingModule injectamos el Token que angular nos proporciona para cambiar la configuracion del router. Luego Usamos el isPlatformServer para comprobar si estamos en el servidor y si es así añadimos la configuración. Seguidamente quitamos la configuración del RouterModule.
