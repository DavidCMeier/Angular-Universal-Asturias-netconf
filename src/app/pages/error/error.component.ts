import {Component, Inject, OnDestroy, OnInit, Optional, PLATFORM_ID} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ErrorStatus} from '../../helpers/errorStatus';
import {RESPONSE} from '@nguniversal/express-engine/tokens';
import {Response} from 'Express';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

  id: number;
  subscribe: Subscription[] = [];
  ErrorSatus = ErrorStatus;

  constructor(private route: ActivatedRoute, @Optional() @Inject(RESPONSE) private response: Response, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit(): void {
    this.subscribe.push(this.route.params.subscribe((params) => {
      const idNumber = Number(params.id);
      this.id = this.checkError(idNumber);
      if (isPlatformServer(this.platformId)) {
        this.response.status(this.id);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscribe.map((sub) => sub.unsubscribe());
  }

  checkError(id: number): ErrorStatus {
    if (isNaN(id)) {
      return ErrorStatus.INTERNAL_SERVER_ERROR;
    }
    const val = ErrorStatus[id];
    return val ? ErrorStatus[val] : ErrorStatus.INTERNAL_SERVER_ERROR;
  }
}
