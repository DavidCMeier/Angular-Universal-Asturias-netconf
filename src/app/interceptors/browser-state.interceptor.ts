import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class BrowserStateInterceptor implements HttpInterceptor {

  constructor(private transferState: TransferState) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const storedRespone: string = this.transferState.get(makeStateKey(req.url), null);
    if (storedRespone) {
      const response = new HttpResponse({body: storedRespone, status: 200});
      return of(response);
    }

    return next.handle(req);
  }

}
