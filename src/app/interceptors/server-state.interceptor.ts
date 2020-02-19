import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TransferState} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class ServerStateInterceptor implements HttpInterceptor {

  constructor(private transferState: TransferState) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
